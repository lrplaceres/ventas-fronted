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
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { FormEvent, useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";

function FormDistribucion() {
  const router = useRouter();

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const [distribucion, setDistribucion] = useState({
    inventario_id: "",
    cantidad: "",
    fecha: new Date(),
    punto_id: "",
  });

  const [inventarios, setInventarios] = useState([]);

  const [puntos, setPuntos] = useState([]);

  const [maximacantidad, setMaximaCantidad] = useState(0);

  useEffect(() => {
    obtenerInventarios();
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setDistribucion({ ...distribucion, [name]: value });
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerInventarios = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/inventarios-a-distribuir`, {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      fetch(`${process.env.MI_API_BACKEND}/distribucion`, {
        method: "POST",
        body: JSON.stringify(distribucion),
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session?.token_type} ${session?.access_token}`,
        },
      })
        .then(function (response) {
          if (response.ok) {
            response.json().then((data) => {
              notificacion(`Se ha creado el distribución`, "success");
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
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" color="primary" align="center">
          INSERTAR DISTRIBUCIÓN
        </Typography>

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={inventarios}
          getOptionLabel={(option) =>
            `${option.nombre} ► $${option.costo} ► \ud83d\udcc5${option.fecha}`
          }
          sx={{ mb: 1 }}
          onChange={(event: any, newValue: string | null) => {
            if (!!newValue) {
              setDistribucion({ ...distribucion, inventario_id: newValue?.id });
              setMaximaCantidad(newValue.cantidad - newValue.distribuido);
              obtenerPuntosNegocio(newValue.negocio_id);
            } else {
              setDistribucion({ ...distribucion, inventario_id: "" });
              setMaximaCantidad(0);
              setDistribucion({ ...distribucion, punto_id: "" });
              setPuntos([]);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Inventario" required />
          )}
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
            inputProps={{ readOnly: puntos.length ? false : true }}
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
          inputProps={{
            min: 1,
            max: maximacantidad,
          }}
          helperText={`Cantidad disponible ${maximacantidad}`}
          disabled={maximacantidad ? false : true}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Fecha"
            onChange={(newvalue) => {
              setDistribucion({ ...distribucion, fecha: newvalue });
            }}
            format="YYYY-MM-DD"
            sx={{ mb: 1 }}
            value={dayjs(moment(distribucion.fecha).utc().format("YYYY-MM-DD"))}
          />
        </LocalizationProvider>

        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="warning"
            sx={{ mr: 1 }}
            onClick={() => router.push("/distribucion")}
            startIcon={<CancelIcon />}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            type="submit"
            sx={{ mr: 1 }}
            startIcon={<DoneIcon />}
          >
            Aceptar
          </Button>
        </Box>
      </form>
    </>
  );
}

function FormNuevaDistribucion() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <FormDistribucion />
    </SnackbarProvider>
  );
}

export default FormNuevaDistribucion;
