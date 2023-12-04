import ReactEcharts from "echarts-for-react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import moment from "moment";
import { useSession } from "next-auth/react";

function GraficoVentas7Dias() {
  const { data: session, update } = useSession();

  const [keys, setKeys] = useState([]);

  const [values, setValues] = useState([]);

  useEffect(() => {
    obtenerVentasPeriodo(
      moment(new Date()).subtract(7, "day").format("YYYY-MM-DD"),
      moment(new Date()).format("YYYY-MM-DD")
    );
  }, []);

  const obtenerVentasPeriodo = async (fecha_inicio: Date, fecha_fin: Date) => {
    var key_tmp: [] = [];
    var values_tmp: [] = []
    await fetch(
      `${process.env.MI_API_BACKEND}/ventas-brutas-periodo/${fecha_inicio}/${fecha_fin}`,
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
        data.map((d:[]) => {
          key_tmp.push(d["fecha"]);
          values_tmp.push(d["monto"]);
        });
        setKeys(key_tmp);
        setValues(values_tmp);
      })
      .catch(function (error) {});
  };

  const option = {
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
      <Typography variant="h6" color="primary" align="center">
        Ventas últimos 7 días
      </Typography>
      <ReactEcharts option={option} />
      <Box pl={5}></Box>
    </>
  );
}

export default GraficoVentas7Dias;
