"use client";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Container,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { FormEvent, useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/es";
import Autocomplete from "@mui/material/Autocomplete";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";

function FormDistribucion() {
  const router = useRouter();

  const params = useParams();

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const [distribucion, setDistribucion] = useState({
    inventario_id: "",
    cantidad: "",
    fecha: new Date(),
    punto_id: "",
    cantidad_inventario: "",
    cantidad_distribuida: "",
  });

  const [inventarios, setInventarios] = useState([]);

  const [puntos, setPuntos] = useState([]);

  const [inventarioEdit, setInventarioEdit] = useState([]);

  useEffect(() => {
    obtenerInventarios();
    obtenerDistribucion(params?.id);
  }, []);

  useEffect(() => {
    setInventarioEdit(
      inventarios.filter((v) => v.id == distribucion.inventario_id)[0]
    );
  }, [inventarios]);

  const handleChange = ({ target: { name, value } }) => {
    setDistribucion({ ...distribucion, [name]: value });
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerInventarios = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/inventarios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setInventarios(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const obtenerPuntosNegocio = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/puntos-negocio/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPuntos(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const obtenerDistribucion = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/distribucion/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDistribucion(data);
        obtenerPuntosNegocio(data.negocio_id);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      fetch(`${process.env.MI_API_BACKEND}/distribucion/${params?.id}`, {
        method: "PUT",
        body: JSON.stringify(distribucion),
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session?.token_type} ${session?.access_token}`,
        },
      })
        .then(function (response) {
          if (response.ok) {
            response.json().then((data) => {
              notificacion(`Se ha editado la distribución`, "info");
              setTimeout(() => router.push("/distribucion"), 300);
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
            {params?.id ? "EDITAR" : "INSERTAR"} DISTRIBUCIÓN
          </Typography>

          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={inventarios}
            getOptionLabel={(option) => `${option.nombre}`}
            sx={{ mb: 1 }}
            value={params?.id ? inventarioEdit : inventarios[0]}
            renderInput={(params) => (
              <TextField {...params} label="Inventario" required />
            )}
            disabled
          />

          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel id="demo-simple-select-label">Punto</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="punto_id"
              label="Punto"
              value={distribucion.punto_id}
              onChange={handleChange}
              required
            >
              {puntos.map((punto, index) => (
                <MenuItem key={index.toString()} value={punto.id}>
                  {punto.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            id="cantidad"
            name="cantidad"
            label="Cantidad"
            value={distribucion.cantidad}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 1 }}
            type="number"
            required
            helperText={`Cantidad Inventario: ${distribucion.cantidad_inventario} Cantidad distribuída: ${distribucion.cantidad_distribuida}`}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              label="Fecha"
              onChange={(newvalue) => {
                setDistribucion({ ...distribucion, fecha: newvalue });
              }}
              format="YYYY-MM-DD"
              sx={{ mb: 1 }}
              value={dayjs(distribucion.fecha)}
            />
          </LocalizationProvider>

          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Button
              variant="contained"
              color="inherit"
              sx={{ mr: 1 }}
              onClick={() => router.push("/distribucion")}
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

function FormEditarDistribucion() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <FormDistribucion />
    </SnackbarProvider>
  );
}

export default FormEditarDistribucion;
