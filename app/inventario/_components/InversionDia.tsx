import { Card, Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function InversionDia() {
  const { data: session, update } = useSession();

  const [monto, setMonto] = useState<number>(0);

  useEffect(() => {
    obtenerInversionesPeriodo(dayjs(new Date()).format("YYYY-MM-DD"), dayjs(new Date()).format("YYYY-MM-DD"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obtenerInversionesPeriodo = async (
    fecha_inicio: any,
    fecha_fin: any
  ) => {
    if (fecha_inicio > fecha_fin) {      
      return "";
    }

    await fetch(
      `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/inventarios-costos-brutos/${fecha_inicio}/${fecha_fin}`,
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
        // setInversiones(data);

        let sum = 0;
        data.map((d: any) => {
          sum += d.monto;
        });
        setMonto(sum);
      })
      .catch(function (error) {
       // notificacion("Se ha producido un error");
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
            flexDirection:"column",
            flexWrap: "nowrap",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item xs={12} sm={12}>
            <Typography variant="h6" color="initial" align="center">
              Inversión
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography variant="h5" color="initial" align="center">
              {currencyFormatter.format(monto)}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

export default InversionDia;
