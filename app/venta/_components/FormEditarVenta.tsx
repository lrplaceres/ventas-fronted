"use client";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  FormControlLabel,
  Switch,
  InputAdornment,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { FormEvent, useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import { DateTimePicker } from "@mui/x-date-pickers";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface Venta {
  distribucion_id: string;
  cantidad: number;
  precio: number;
  fecha: Date | Dayjs | null;
  punto_id: number | string;
  pago_electronico: boolean;
  no_operacion: string;
  pago_diferido: boolean;
  descripcion: string | null;
  nombre_producto: string;
}

function FormVenta() {
  const router = useRouter();

  const params = useParams();

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const [venta, setVenta] = useState<Venta>({
    distribucion_id: "",
    cantidad: 0,
    precio: 0,
    fecha: new Date(),
    punto_id: "",
    nombre_producto: "",
    descripcion: "",
    pago_diferido: false,
    pago_electronico: false,
    no_operacion: "",
  });

  useEffect(() => {
    const obtenerVenta = async (id: any) => {
      await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/venta/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setVenta(data);
        })
        .catch(function (error) {
          notificacion("Se ha producido un error");
        });
    };

    obtenerVenta(params?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = ({ target: { name, value } }: any) => {
    setVenta({ ...venta, [name]: value });
  };

  const handleChangeSlider = ({ target: { name, checked } }: any) => {
    setVenta({ ...venta, [name]: checked });
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/venta/${params?.id}`, {
        method: "PUT",
        body: JSON.stringify(venta),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      })
        .then(function (response) {
          if (response.ok) {
            response.json().then((data) => {
              notificacion(`Se ha editado la venta`, "info");
              setTimeout(() => router.push("/venta"), 300);
            });
          } else {
            response.json().then((data) => {
              notificacion(`${data.detail}`);
            });
          }
        })
        .catch(function (error: any) {
          notificacion("Se ha producido un error");
        });
    } catch (error: any) {
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

          <FormControlLabel
            control={
              <Switch
                name="pago_electronico"
                onChange={handleChangeSlider}
                checked={venta.pago_electronico}
              />
            }
            label="Pago electrónico"
            sx={{ mb: 1 }}
          />

          <FormControlLabel
            control={
              <Switch
                name="pago_diferido"
                onChange={handleChangeSlider}
                checked={venta.pago_diferido}
              />
            }
            label="Pago diferido"
            sx={{ mb: 1 }}
          />

          <TextField
            id="no_operacion"
            name="no_operacion"
            label="No. operación"
            value={venta.no_operacion}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 1, display: venta.pago_electronico ? "block" : "none" }}
          />

          <TextField
            id="descripcion"
            name="descripcion"
            label="Descripción del pago"
            value={venta.descripcion}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 1, display: venta.pago_diferido ? "" : "none" }}
            required={venta.pago_diferido ? true : false}
            multiline
            rows={2}
          />

          <TextField
            id="prodcuto"
            label="Producto"
            value={venta.nombre_producto}
            disabled={true}
            fullWidth
            sx={{ mb: 1 }}
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
            InputProps={{
              endAdornment: <InputAdornment position="end">{currencyFormatter.format(venta.cantidad * venta.precio)}</InputAdornment>,
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DateTimePicker
              label="Fecha"
              onChange={(newvalue) => {
                setVenta({ ...venta, fecha: newvalue });
              }}
              format="YYYY-MM-DD"
              sx={{ mb: 1 }}
              value={dayjs(venta.fecha)}
            />
          </LocalizationProvider>

          <Box sx={{ textAlign: "center", mb: 4 }}>
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

function FormEditarVenta() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <FormVenta />
    </SnackbarProvider>
  );
}

export default FormEditarVenta;
