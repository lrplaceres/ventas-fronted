"use client";
import {
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { FormEvent, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";

function FormDistribucion() {
  const router = useRouter();

  const params = useParams();

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [distribucion, setDistribucion] = useState({
    inventario_id: "",
    cantidad: "",
    fecha: new Date(),
    punto_id: "",
  });

  const [disponible, setDisponible] = useState({
    cantidad_distribuida: "",
    cantidad_inventario: "",
  });

  const [inventarios, setInventarios] = useState([]);

  const [puntos, setPuntos] = useState([]);

  const [inventarioEdit, setInventarioEdit] = useState([]);

  useEffect(() => {
    obtenerPuntos();
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

  const obtenerPuntos = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/puntos`, {
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
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (params?.id) {
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
                notificacion(`Se ha editado la distribución`, "success");
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
      } else {
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
      }
    } catch (error) {
      return notificacion(error);
    }
  };

  const eliminarDistribucion = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/distribucion/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then(function (response) {
        if (response.ok) {
          notificacion(`La distribución se ha sido eliminado`, "success");
          setTimeout(() => router.push("/distribucion"), 300);
        } else {
          response.json().then((data) => {
            notificacion(`${data.detail}`);
          });
        }
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  return (
    <>
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
          onChange={(event: any, newValue: string | null) => {
            setDistribucion({ ...distribucion, inventario_id: newValue?.id });
            setInventarioEdit(newValue);
            if (!!newValue) {
              obtenerDisponible(newValue?.id);
            }
          }}
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
          helperText={`Cantidad Inventario: ${disponible.cantidad_inventario} Cantidad distribuída: ${disponible.cantidad_distribuida}`}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={(newvalue) => {
              setDistribucion({ ...distribucion, fecha: newvalue });
            }}
            format="YYYY-MM-DD"
            sx={{ mb: 1 }}
            value={dayjs(moment(distribucion.fecha).utc().format("YYYY-MM-DD"))}
          />
        </LocalizationProvider>

        <Card variant="outlined" sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="warning"
            sx={{ mr: 1 }}
            onClick={() => router.push("/distribucion")}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            type="submit"
            sx={{ mr: 1 }}
          >
            Aceptar
          </Button>

          {params?.id && (
            <Button variant="contained" color="error" onClick={handleClickOpen}>
              Eliminar
            </Button>
          )}
        </Card>
      </form>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Eliminar distribución"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Al confirmar esta acción <strong>se borrarán los datos</strong>{" "}
            relacionados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={() => eliminarDistribucion(params?.id)}
            autoFocus
            color="error"
          >
            Estoy de acuerdo
          </Button>
        </DialogActions>
      </Dialog>
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
