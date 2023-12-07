"use client";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { FormEvent, useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/es";
import Autocomplete from "@mui/material/Autocomplete";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import { DateTimePicker } from "@mui/x-date-pickers";

function FormVenta() {
  const router = useRouter();

  const params = useParams();

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const [venta, setVenta] = useState({
    distribucion_id: "",
    cantidad: "",
    precio: "",
    fecha: new Date(),
    punto_id: "",
  });

  const [distribuciones, setDistribuciones] = useState([]);

  const [distribucionEdit, setDistribucionEdit] = useState([]);

  const [maximacantidad, setMaximaCantidad] = useState(0);

  const [um, setUm] = useState("");

  useEffect(() => {
    obtenerDistribuciones();
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setVenta({ ...venta, [name]: value });
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerDistribuciones = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/distribuciones-venta`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDistribuciones(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      fetch(`${process.env.MI_API_BACKEND}/venta`, {
        method: "POST",
        body: JSON.stringify(venta),
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session?.token_type} ${session?.access_token}`,
        },
      })
        .then(function (response) {
          if (response.ok) {
            response.json().then((data) => {
              notificacion(`Se ha insertado la venta`, "info");
              setTimeout(() => router.push("/venta"), 300);
            });
          } else {
            response.json().then((data) => {
              notificacion(`${data.detail}`);
            });
          }
        })
        .catch(function (error) {
          notificacion("Se ha producido un error");
        });
    } catch (error) {
      return notificacion(error);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" color="primary" align="center">
            INSERTAR VENTA
          </Typography>

          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={distribuciones}
            getOptionLabel={(option) =>
              `${option.nombre_producto} ► ${option.nombre_punto} ► \ud83d\udcc5${option.fecha}`
            }
            sx={{ mb: 1 }}
            value={params?.id ? distribucionEdit : distribuciones[0]}
            onChange={(event: any, newValue: string | null) => {
              if (!!newValue) {
                setVenta({
                  ...venta,
                  distribucion_id: newValue.id,
                  punto_id: newValue.punto_id,
                  precio: newValue.precio_venta,
                });
                setDistribucionEdit(newValue);
                setMaximaCantidad(
                  newValue.cantidad - newValue.cantidad_vendida
                );
                setUm(newValue.um);
              } else {
                setVenta({
                  ...venta,
                  distribucion_id: "",
                  punto_id: "",
                  precio: "",
                  cantidad: "",
                });
                setDistribucionEdit([]);
                setMaximaCantidad(0);
                setUm("");
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Producto" required />
            )}
            disabled={distribuciones.length > 0 ? false : true}
          />

          <TextField
            id="cantidad"
            name="cantidad"
            label="Cantidad"
            value={venta.cantidad}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 1 }}
            type="number"
            required
            inputProps={{
              max: maximacantidad,
            }}
            helperText={`Cantidad disponible: ${maximacantidad} UM: ${um}`}
            disabled={venta.distribucion_id ? false : true}
          />

          <TextField
            id="precio"
            name="precio"
            label="Precio"
            value={venta.precio}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 1 }}
            type="number"
            required
          />

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DateTimePicker
              label="Fecha"
              onChange={(newvalue) => {
                setVenta({
                  ...venta,
                  fecha: newvalue,
                });
              }}
              format="YYYY-MM-DD"
              sx={{ mb: 1 }}
              value={dayjs(venta.fecha)}
            />
          </LocalizationProvider>

          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="inherit"
              sx={{ mr: 1 }}
              onClick={() => router.push("/venta")}
              startIcon={<CancelIcon />}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mr: 1 }}
              startIcon={<DoneIcon />}
            >
              Aceptar
            </Button>
          </Box>
        </form>
      </Container>
    </>
  );
}

function FormNuevaVenta() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <FormVenta />
    </SnackbarProvider>
  );
}

export default FormNuevaVenta;
