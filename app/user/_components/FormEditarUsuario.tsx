"use client";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Card,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function FormUsuario() {
  const router = useRouter();

  const params = useParams();

  const { enqueueSnackbar } = useSnackbar();

  const [usuario, setUsuario] = useState({
    usuario: "",
    rol: "propietario",
    nombre: "",
    email: "",
    activo: true,
  });

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  useEffect(() => {
    if (params.id) {
      obtenerUsuario(params.id);
    }
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setUsuario({ ...usuario, [name]: value });
  };

  const handleChangeSlider = ({ target: { name, checked } }) => {
    setUsuario({ ...usuario, [name]: checked });
  };

  const notificacion = (mensaje: string, variant: VariantType) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerUsuario = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/user/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsuario(data);
      });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      var data = {
        rol: usuario.rol,
        nombre: usuario.nombre,
        email: usuario.email,
        activo: usuario.activo,
      };

      fetch(`${process.env.MI_API_BACKEND}/user/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function (response) {
        if (response.ok) {
          notificacion(`Se ha editado el usuario ${usuario.usuario}`, "success");
          setTimeout(() => router.push("/user"), 300);
        } else {
          notificacion(`Se ha producido un error ${response.status}`, "error");
        }
      });
    } catch (error) {
      return notificacion(error, "error");
    }
  };

  const eliminarUsuario = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(function (response) {
      if (!response.ok) {
        return notificacion("Se ha producido un error", "error");
      }

      notificacion(
        `El usuario ${usuario.usuario} ha sido eliminado`,
        "success"
      );
      setTimeout(() => router.push("/user"), 300);
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" color="primary" align="center">
          EDITAR USUARIO
        </Typography>

        <TextField
          id="usuario"
          label="Usuario"
          value={usuario.usuario}
          fullWidth
          sx={{ mb: "0.5rem" }}
          disabled
        />

        <FormControlLabel
          control={
            <Switch
              name="activo"
              onChange={handleChangeSlider}
              checked={usuario.activo}
            />
          }
          label="Activo"
          sx={{ mb: ".5rem" }}
        />

        <FormControl fullWidth sx={{ mb: ".5rem" }}>
          <InputLabel id="demo-simple-select-label">Rol</InputLabel>
          <Select
            name="rol"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={usuario.rol}
            label="Rol"
            onChange={handleChange}
            required
          >
            <MenuItem value={"dependiente"}>Dependiente</MenuItem>
            <MenuItem value={"propietario"}>Propietario</MenuItem>
            <MenuItem value={"superadmin"}>Superadmin</MenuItem>
          </Select>
        </FormControl>

        <TextField
          id="nombre"
          name="nombre"
          label="Nombre"
          fullWidth
          value={usuario.nombre}
          onChange={handleChange}
          sx={{ mb: ".5rem" }}
        />
        <TextField
          id="email"
          name="email"
          label="Correo electrónico"
          fullWidth
          value={usuario.email}
          onChange={handleChange}
          sx={{ mb: ".5rem" }}
          type="email"
        />

        <Card variant="outlined" sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="warning"
            sx={{ mr: ".5rem" }}
            onClick={() => router.push("/user")}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            type="submit"
            sx={{ mr: ".5rem" }}
          >
            Aceptar
          </Button>

          {params.id && (
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
        <DialogTitle id="alert-dialog-title">{"Eliminar usuario"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Al confirmar esta acción <strong>se borrarán los datos</strong>{" "}
            relacionados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={() => eliminarUsuario(params.id)}
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

function FormEditarUsuario() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <FormUsuario />
    </SnackbarProvider>
  );
}

export default FormEditarUsuario;
