import { Card, Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const currencyFormatterCount = new Intl.NumberFormat("en-US");

function VentasDia() {
  const { data: session, update } = useSession();


  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    obtenerVentas(dayjs(new Date()).format("YYYY-MM-DD"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obtenerVentas = async (fecha: any) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/ventas-periodo/${fecha}/${fecha}`,
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
        //setVentas(data);

        let sum = 0;
          data.map((d: any) => {
            sum += d.cantidad;
          });
          setTotal(sum);
      })
      .catch(function (error) {
        //notificacion("Se ha producido un error");
      });
  };

  return (
    <>
      <Card variant="outlined" sx={{ p: 1 }}>
        <Grid
          container
          spacing={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item xs={12}>
            <Typography variant="h6" color="initial" align="center">
              Ventas
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" color="initial" align="center">
              {currencyFormatterCount.format(total)}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

export default VentasDia;
