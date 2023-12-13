"use client";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Container,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useSession } from "next-auth/react";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function FormUsuario() {
  const router = useRouter();

  const params = useParams();

  const { data: session, update } = useSession();

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
    
      const obtenerUsuario = async (id: number) => {
        await fetch(`${process.env.MI_API_BACKEND}/user/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${session?.token_type} ${session?.access_token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setUsuario(data);
          })
          .catch(function (error) {
            notificacion("Se ha producido un error");
          });
      };

      obtenerUsuario(params?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = ({ target: { name, value } } : any) => {
    setUsuario({ ...usuario, [name]: value });
  };

  const handleChangeSlider = ({ target: { name, checked } } : any) => {
    setUsuario({ ...usuario, [name]: checked });
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
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

      fetch(`${process.env.MI_API_BACKEND}/user/${params?.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session?.token_type} ${session?.access_token}`,
        },
      })
        .then(function (response) {
          if (response.ok) {
            notificacion(`Se ha editado el usuario ${usuario.usuario}`, "info");
            setTimeout(() => router.push("/usuario"), 300);
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
            EDITAR USUARIO
          </Typography>

          <TextField
            id="usuario"
            label="Usuario"
            value={usuario.usuario}
            fullWidth
            sx={{ mb: 1 }}
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
            sx={{ mb: 1 }}
          />

          <FormControl fullWidth sx={{ mb: 1 }}>
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
            sx={{ mb: 1 }}
          />
          <TextField
            id="email"
            name="email"
            label="Correo electrónico"
            fullWidth
            value={usuario.email}
            onChange={handleChange}
            sx={{ mb: 1 }}
            type="email"
          />

          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Button
              variant="contained"
              color="inherit"
              sx={{ mr: 1 }}
              onClick={() => router.push("/usuario")}
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
