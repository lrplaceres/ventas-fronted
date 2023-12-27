import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Card, CardContent } from "@mui/material";

function Producto() {
  return (
    <>
      <Box id="#producto">
        <Typography variant="h4" color="primary" textAlign="center">
          ¿Por qué elegir SIMPLE?
        </Typography>

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{border: 1, borderColor: "primary.main"}}>
                <CardContent>
                  <Typography variant="h6" color="primary" component="div">
                    Control sobre tus recursos
                  </Typography>
                  <Typography variant="body2" height={60} mt={2}>
                    Usted puede saber en tiempo real toda la información sobre
                    el estado de tu negocio, así como tus Productos, Inventarios
                    y Ventas.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{border: 1, borderColor: "primary.main"}}>
                <CardContent>
                  <Typography variant="h6" color="primary" component="div">
                    Disponibilidad y Seguridad
                  </Typography>
                  <Typography variant="body2" height={60} mt={2}>
                    Es accesible desde cualquier dispositivo con acceso a
                    internet, garantizando la confidencialidad e integridad de
                    la información.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{border: 1, borderColor: "primary.main"}}>
                <CardContent>
                  <Typography variant="h6" color="primary" component="div">
                    Mejoras continuas
                  </Typography>
                  <Typography variant="body2" height={60} mt={2}>
                    Nuestros clientes son parte del equipo de desarrollo y
                    participan en la creación, correción y validación de las
                    nuevas funcionalidades.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{border: 1, borderColor: "primary.main"}}>
                <CardContent>
                  <Typography variant="h6" color="primary" component="div">
                    Asistencia técnica
                  </Typography>
                  <Typography variant="body2" height={60} mt={2}>
                    Contamos con un equipo de trabajo altamente preparado,
                    disponible cualquier día de la semana para darle una
                    asistencia rápida y personalizada.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default Producto;
