import ReactEcharts from "echarts-for-react";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";

function GraficoInversion7Dias() {
  const { data: session, update } = useSession();

  const [keys, setKeys] = useState([]);

  const [values, setValues] = useState([]);

  useEffect(() => {
    obtenerInversionPeriodo(
      dayjs(new Date()).subtract(7, "day").format("YYYY-MM-DD"),
      dayjs(new Date()).format("YYYY-MM-DD")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obtenerInversionPeriodo = async (
    fecha_inicio: any,
    fecha_fin: any
  ) => {
    var key_tmp: [] = [];
    var values_tmp: [] = [];
    await fetch(
      `${process.env.MI_API_BACKEND}/inventarios-costos-brutos/${fecha_inicio}/${fecha_fin}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session?.token_type} ${session?.access_token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        data.map((d: never) => {
          key_tmp.push(d["fecha"]);
          values_tmp.push(d["monto"]);
        });
        setKeys(key_tmp);
        setValues(values_tmp);
      })
      .catch(function (error) {});
  };

  const option = {
    title: {
      text: 'Inversión últimos 7 días',
      left: 'center'
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: keys,
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: values,
        type: "bar",
        barWidth: '60%',
      },
    ],
  };

  return (
    <>
      <ReactEcharts option={option} />
    </>
  );
}

export default GraficoInversion7Dias;