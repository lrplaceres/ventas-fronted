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
import { useParams, useRouter } from "next/navigation";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { FormEvent, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function FormPunto() {
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

  const [punto, setPunto] = useState({
    nombre: "",
    direccion: "",
    negocio_id: "",
  });

  const [negocios, setNegocios] = useState([]);

  useEffect(() => {
    obtenerNegociosPropietario();
    if (params?.id) {
      obtenerPunto(params?.id);
    }
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setPunto({ ...punto, [name]: value });
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerNegociosPropietario = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/negocios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNegocios(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const obtenerPunto = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/punto/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then(function (response) {
        if (response.ok) {
          var result = response.json();
          result.then((data) => {
            setPunto(data);
          });
        } else {
          notificacion("Revise los datos asignados");
        }
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (params?.id) {
        fetch(`${process.env.MI_API_BACKEND}/punto/${params?.id}`, {
          method: "PUT",
          body: JSON.stringify(punto),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${session?.token_type} ${session?.access_token}`,
          },
        })
          .then(function (response) {
            if (response.ok) {
              response.json().then((data) => {
                notificacion(
                  `Se ha editado el Punto ${punto.nombre}`,
                  "info"
                );
                setTimeout(() => router.push("/punto"), 300);
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
        fetch(`${process.env.MI_API_BACKEND}/punto`, {
          method: "POST",
          body: JSON.stringify(punto),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${session?.token_type} ${session?.access_token}`,
          },
        })
          .then(function (response) {
            if (response.ok) {
              response.json().then((data) => {
                notificacion(
                  `Se ha creado el Punto ${punto.nombre}`,
                  "info"
                );
                setTimeout(() => router.push("/punto"), 300);
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

  const eliminarPunto = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/punto/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then(function (response) {
        if (response.ok) {
          notificacion(`El Punto ${punto.nombre} ha sido eliminado`, "info");
          setTimeout(() => router.push("/punto"), 300);
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
          {params?.id ? "EDITAR" : "INSERTAR"} PUNTO
        </Typography>

        <TextField
          id="nombre"
          name="nombre"
          label="Nombre"
          value={punto.nombre}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 1 }}
          required
        />

        <TextField
          id="direccion"
          name="direccion"
          label="Dirección"
          value={punto.direccion}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 1 }}
          required
        />

        <FormControl fullWidth>
          <InputLabel>Negocio</InputLabel>
          <Select
            id="negocio_id"
            name="negocio_id"
            value={punto.negocio_id}
            label="Negocio"
            onChange={handleChange}
            sx={{ mb: 1 }}
            required
          >
            {negocios.length > 0 &&
              negocios.map((negocio, index) => (
                <MenuItem key={index.toString()} value={negocio.id}>
                  {negocio.nombre}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Box sx={{ textAlign: "center", mb:4 }}>
          <Button
            variant="contained"
            color="inherit"
            sx={{ mr: 1 }}
            onClick={() => router.push("/punto")}
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

        <Box sx={{ textAlign: "center" }}>
          {params?.id && (
            <Button
              variant="contained"
              color="error"
              onClick={handleClickOpen}
              startIcon={<DeleteForeverIcon />}
            >
              Eliminar
            </Button>
          )}
        </Box>
      </form>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Eliminar punto"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Al confirmar esta acción <strong>se borrarán los datos</strong>{" "}
            relacionados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={() => eliminarPunto(params?.id)}
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

function FormNuevoPunto() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <FormPunto />
    </SnackbarProvider>
  );
}

export default FormNuevoPunto;
