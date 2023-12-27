import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";

function GraficoVentas7Dias() {
  const { data: session, update } = useSession();

  const [keys, setKeys] = useState([]);

  const [values, setValues] = useState([]);

  useEffect(() => {
    const obtenerVentasPeriodo = async (fecha_inicio: any, fecha_fin: any) => {
      var key_tmp: [] = [];
      var values_tmp: [] = []
      await fetch(
        `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/ventas-brutas-periodo/${fecha_inicio}/${fecha_fin}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          data.map((d:never) => {
            key_tmp.push(d["fecha"]);
            values_tmp.push(d["monto"]);
          });
          setKeys(key_tmp);
          setValues(values_tmp);
        })
        .catch(function (error) {});
    };

    obtenerVentasPeriodo(
      dayjs(new Date()).subtract(7, "day").format("YYYY-MM-DD"),
      dayjs(new Date()).format("YYYY-MM-DD")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const option = {
    title: {
      text: 'Ventas últimos 7 días',
      left: 'center'
    },
    xAxis: {
      type: "category",
      data: keys,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: values,
        type: "line",
      },
    ],
  };

  return (
    <>
      <ReactEcharts option={option} />
    </>
  );
}

export default GraficoVentas7Dias;
