"use client";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Container,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { useSession } from "next-auth/react";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";

function FormUsuario() {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { data: session, update } = useSession();

  const [usuario, setUsuario] = useState({    
    usuario: "",
    password: "",
    nombre: "",
    email: "",
    activo: true,
    punto_id: "",
  });

  const [puntos, setPuntos] = useState([]);

  useEffect(() => {

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
    
    obtenerPuntos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = ({ target: { name, value } } : any) => {
    setUsuario({ ...usuario, [name]: value });
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };



  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (usuario.password != usuario.repite) {
        return notificacion("Las contraseñas deben coincidir", "error");
      }

      var data = {
        usuario: usuario.usuario,
        password: usuario.password,
        nombre: usuario.nombre,
        email: usuario.email,
        activo: usuario.activo,
        punto_id: usuario.punto_id,
      };

      fetch(`${process.env.MI_API_BACKEND}/dependiente`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session?.token_type} ${session?.access_token}`,
        },
      })
        .then(function (response) {
          if (response.ok) {
            response.json().then((data) => {
              notificacion(`Se ha creado el dependiente ${data.usuario}`, "info");
              setTimeout(() => router.push("/dependiente"), 300);
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
    } catch (error) {
      return notificacion(error: any);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" color="primary" align="center">
            INSERTAR DEPENDIENTE
          </Typography>

          <TextField
            id="usuario"
            name="usuario"
            label="Usuario"
            fullWidth
            value={usuario.usuario}
            onChange={handleChange}
            sx={{ mb: 1 }}
            required
          />
          <TextField
            id="password"
            name="password"
            label="Contraseña"
            fullWidth
            value={usuario.password}
            onChange={handleChange}
            sx={{ mb: 1 }}
            type="password"
            required
          />
          <TextField
            id="repite"
            name="repite"
            label="Repite contraseña"
            fullWidth
            value={usuario.repite}
            onChange={handleChange}
            sx={{ mb: 1 }}
            type="password"
            required
          />

          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel id="demo-simple-select-label">Punto</InputLabel>
            <Select
              name="punto_id"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={usuario.punto_id}
              label="Punto"
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

          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="inherit"
              sx={{ mr: 1 }}
              onClick={() => router.push("/dependiente")}
              startIcon={<CancelIcon />}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="info"
              type="submit"
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

function FormNuevoDependiente() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <FormUsuario />
    </SnackbarProvider>
  );
}

export default FormNuevoDependiente;
