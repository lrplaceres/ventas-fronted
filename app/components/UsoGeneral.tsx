import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { useSession } from "next-auth/react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

interface ContadorUsuarios {
  cantidad_usuarios: number;
  nuevos_usuarios: number;
}

interface ContadorNegocios {
  cantidad_negocios: number;
  nuevos_negocios: number;
}

interface ContadorPuntos {
  cantidad_puntos: number;
  nuevos_puntos: number;
}

interface ContadorProductos {
  cantidad_productos: number;
  nuevos_productos: number;
}

interface ContadorInventarios {
  cantidad_inventarios: number;
  nuevos_inventarios: number;
}

interface ContadorDistribuciones {
  cantidad_distribuciones: number;
  nuevas_distribuciones: number;
}

interface ContadorVentas {
  cantidad_ventas: number;
  nuevas_ventas: number;
}

function createData(nombre: string, valor: number) {
  return { nombre, valor };
}

function Page() {
  const { data: session, update } = useSession();

  const [contadorUsuarios, setContadorUsuarios] = useState<ContadorUsuarios>({
    cantidad_usuarios: 0,
    nuevos_usuarios: 0,
  });

  const [contadorNegocios, setContadorNegocios] = useState<ContadorNegocios>({
    cantidad_negocios: 0,
    nuevos_negocios: 0,
  });

  const [contadorPuntos, setContadorPuntos] = useState<ContadorPuntos>({
    cantidad_puntos: 0,
    nuevos_puntos: 0,
  });

  const [contadorProductos, setContadorProductos] = useState<ContadorProductos>(
    {
      cantidad_productos: 0,
      nuevos_productos: 0,
    }
  );

  const [contadorInventarios, setContadorInventarios] =
    useState<ContadorInventarios>({
      cantidad_inventarios: 0,
      nuevos_inventarios: 0,
    });

  const [contadorDistribuciones, setContadorDistribuciones] =
    useState<ContadorDistribuciones>({
      cantidad_distribuciones: 0,
      nuevas_distribuciones: 0,
    });

  const [contadorVentas, setContadorVentas] = useState<ContadorVentas>({
    cantidad_ventas: 0,
    nuevas_ventas: 0,
  });

  const [fechas, setFechas] = useState({
    fecha_inicio: dayjs(new Date()).subtract(7, "day").format("YYYY-MM-DD"),
    fecha_fin: dayjs(new Date()).format("YYYY-MM-DD"),
  });

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { enqueueSnackbar } = useSnackbar();

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const rows = [
    createData("Total de usuarios", contadorUsuarios.cantidad_usuarios),
    createData("Nuevos usuarios", contadorUsuarios.nuevos_usuarios),
    createData("Total de negocios", contadorNegocios.cantidad_negocios),
    createData("Nuevos negocios", contadorNegocios.nuevos_negocios),
    createData("Total de puntos", contadorPuntos.cantidad_puntos),
    createData("Nuevos puntos", contadorPuntos.nuevos_puntos),
    createData("Total de productos", contadorProductos.cantidad_productos),
    createData("Nuevos productos", contadorProductos.nuevos_productos),
  ];

  const rows2 = [
    createData(
      "Total de inventarios",
      contadorInventarios.cantidad_inventarios
    ),
    createData("Nuevos inventarios", contadorInventarios.nuevos_inventarios),
    createData(
      "Total de distribuciones",
      contadorDistribuciones.cantidad_distribuciones
    ),
    createData(
      "Nuevas distribuciones",
      contadorDistribuciones.nuevas_distribuciones
    ),
    createData("Total de ventas", contadorVentas.cantidad_ventas),
    createData("Nuevas ventas", contadorVentas.nuevas_ventas),
  ];

  useEffect(() => {
    obtenerContadorUsuario(fechas.fecha_inicio, fechas.fecha_fin);
    obtenerContadorNegocios(fechas.fecha_inicio, fechas.fecha_fin);
    obtenerContadorPuntos(fechas.fecha_inicio, fechas.fecha_fin);
    obtenerContadorProductos(fechas.fecha_inicio, fechas.fecha_fin);
    obtenerContadorInventarios(fechas.fecha_inicio, fechas.fecha_fin);
    obtenerContadorDistribuciones(fechas.fecha_inicio, fechas.fecha_fin);
    obtenerContadorVentas(fechas.fecha_inicio, fechas.fecha_fin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obtenerContadorUsuario = async (fecha_inicio: any, fecha_fin: any) => {
    if (fecha_inicio > fecha_fin) {
      setContadorUsuarios({ cantidad_usuarios: 0, nuevos_usuarios: 0 });
      return notificacion("La fecha fin debe ser mayor que la fecha inicio");
    }
    await fetch(
      `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/users-contador/${fecha_inicio}/${fecha_fin}`,
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
        setContadorUsuarios(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const obtenerContadorNegocios = async (fecha_inicio: any, fecha_fin: any) => {
    if (fecha_inicio > fecha_fin) {
      setContadorNegocios({ cantidad_negocios: 0, nuevos_negocios: 0 });
    }
    await fetch(
      `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/negocios-contador/${fecha_inicio}/${fecha_fin}`,
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
        setContadorNegocios(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const obtenerContadorPuntos = async (fecha_inicio: any, fecha_fin: any) => {
    if (fecha_inicio > fecha_fin) {
      setContadorPuntos({ cantidad_puntos: 0, nuevos_puntos: 0 });
    }
    await fetch(
      `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/puntos-contador/${fecha_inicio}/${fecha_fin}`,
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
        setContadorPuntos(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const obtenerContadorProductos = async (
    fecha_inicio: any,
    fecha_fin: any
  ) => {
    if (fecha_inicio > fecha_fin) {
      setContadorProductos({ cantidad_productos: 0, nuevos_productos: 0 });
    }
    await fetch(
      `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/productos-contador/${fecha_inicio}/${fecha_fin}`,
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
        setContadorProductos(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const obtenerContadorInventarios = async (
    fecha_inicio: any,
    fecha_fin: any
  ) => {
    if (fecha_inicio > fecha_fin) {
      setContadorInventarios({
        cantidad_inventarios: 0,
        nuevos_inventarios: 0,
      });
    }
    await fetch(
      `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/inventarios-contador/${fecha_inicio}/${fecha_fin}`,
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
        setContadorInventarios(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const obtenerContadorDistribuciones = async (
    fecha_inicio: any,
    fecha_fin: any
  ) => {
    if (fecha_inicio > fecha_fin) {
      setContadorDistribuciones({
        cantidad_distribuciones: 0,
        nuevas_distribuciones: 0,
      });
    }
    await fetch(
      `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/distribuciones-contador/${fecha_inicio}/${fecha_fin}`,
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
        setContadorDistribuciones(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const obtenerContadorVentas = async (fecha_inicio: any, fecha_fin: any) => {
    if (fecha_inicio > fecha_fin) {
      setContadorVentas({ cantidad_ventas: 0, nuevas_ventas: 0 });
    }
    await fetch(
      `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/ventas-contador/${fecha_inicio}/${fecha_fin}`,
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
        setContadorVentas(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  return (
    <>
      <Container maxWidth="lg">
        <div style={{ display: "flex", marginTop: 10, marginBottom: 5 }}>
          <div style={{ flexGrow: 1 }}>
            <IconButton
              aria-label="filtericon"
              color="inherit"
              onClick={handleClickOpen}
            >
              <FilterAltIcon />
            </IconButton>
          </div>
        </div>

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TableContainer>
                <Table
                  sx={{ minWidth: "100%" }}
                  size="small"
                  aria-label="simple table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.nombre}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.nombre}
                        </TableCell>
                        <TableCell align="right">{row.valor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TableContainer>
                <Table
                  sx={{ minWidth: "100%" }}
                  size="small"
                  aria-label="simple table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows2.map((row) => (
                      <TableRow
                        key={row.nombre}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.nombre}
                        </TableCell>
                        <TableCell align="right">{row.valor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Filtrar información"}
          </DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Fecha inicio"
                onChange={(newvalue: any) => {
                  obtenerContadorUsuario(
                    newvalue?.format("YYYY-MM-DD"),
                    fechas.fecha_fin
                  );
                  obtenerContadorNegocios(
                    newvalue?.format("YYYY-MM-DD"),
                    fechas.fecha_fin
                  );
                  obtenerContadorPuntos(
                    newvalue?.format("YYYY-MM-DD"),
                    fechas.fecha_fin
                  );
                  obtenerContadorProductos(
                    newvalue?.format("YYYY-MM-DD"),
                    fechas.fecha_fin
                  );
                  obtenerContadorInventarios(
                    newvalue?.format("YYYY-MM-DD"),
                    fechas.fecha_fin
                  );
                  obtenerContadorDistribuciones(
                    newvalue?.format("YYYY-MM-DD"),
                    fechas.fecha_fin
                  );
                  obtenerContadorVentas(
                    newvalue?.format("YYYY-MM-DD"),
                    fechas.fecha_fin
                  );
                  setFechas({
                    ...fechas,
                    fecha_inicio: newvalue.format("YYYY-MM-DD"),
                  });
                }}
                format="YYYY-MM-DD"
                value={dayjs(fechas.fecha_inicio)}
                sx={{ mb: 1, mt: 1 }}
              />
            </LocalizationProvider>
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Fecha fin"
                onChange={(newvalue: any) => {
                  obtenerContadorUsuario(
                    fechas.fecha_inicio,
                    newvalue?.format("YYYY-MM-DD")
                  );
                  obtenerContadorNegocios(
                    fechas.fecha_inicio,
                    newvalue?.format("YYYY-MM-DD")
                  );
                  obtenerContadorPuntos(
                    fechas.fecha_inicio,
                    newvalue?.format("YYYY-MM-DD")
                  );
                  obtenerContadorProductos(
                    fechas.fecha_inicio,
                    newvalue?.format("YYYY-MM-DD")
                  );
                  obtenerContadorInventarios(
                    fechas.fecha_inicio,
                    newvalue?.format("YYYY-MM-DD")
                  );
                  obtenerContadorDistribuciones(
                    fechas.fecha_inicio,
                    newvalue?.format("YYYY-MM-DD")
                  );
                  obtenerContadorVentas(
                    fechas.fecha_inicio,
                    newvalue?.format("YYYY-MM-DD")
                  );
                  setFechas({
                    ...fechas,
                    fecha_fin: newvalue.format("YYYY-MM-DD"),
                  });
                }}
                format="YYYY-MM-DD"
                value={dayjs(fechas.fecha_fin)}
                sx={{ mb: 1, mt: 1 }}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

function PageUsoGeneral() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageUsoGeneral;
