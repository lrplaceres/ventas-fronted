import ReactEcharts from "echarts-for-react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

function GraficoInversion7Dias() {
  const option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  };

  return (
    <>
      <Typography variant="h6" color="primary" align="center">
        Inversión últimos 7 días
      </Typography>
      <ReactEcharts option={option} />
      <Box pl={5}></Box>
    </>
  );
}

export default GraficoInversion7Dias;