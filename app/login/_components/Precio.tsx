import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Card, CardContent, Paper } from "@mui/material";

function Precio() {
  return (
    <>
      <Box id="precio" sx={{ mt: 3 }}>
        <Typography variant="h4" color="primary" textAlign="center">
          ¿Conoce nuestros planes?
        </Typography>

        <Typography variant="h6" color="warning" textAlign="center" mb={2}>
          Prueba una semana gratis
        </Typography>

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <Paper elevation={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="caption"
                      color="initial"
                      component="div"
                    >
                      Plan básico
                    </Typography>
                    <Typography variant="h4" color="error">
                      $XXX
                    </Typography>
                    <Typography variant="body2" height={70}>
                      Pago en MN. Plan de suscripción mensual.
                    </Typography>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper elevation={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="caption"
                      color="initial"
                      component="div"
                    >
                      Plan pro
                    </Typography>
                    <Typography variant="h4" color="error">
                      $XXXX
                    </Typography>
                    <Typography variant="body2" height={70}>
                      Pago en MN. Plan de suscripción trimestral. Incluye dos
                      negocios. Ahorre un 10%.
                    </Typography>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper elevation={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="caption"
                      color="initial"
                      component="div"
                    >
                      Plan premium
                    </Typography>
                    <Typography variant="h4" color="error">
                      $XXXX
                    </Typography>
                    <Typography variant="body2" height={70}>
                      Pago en MN. Plan de suscripción anual. Incluye número
                      ilimitado negocios.
                    </Typography>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default Precio;
