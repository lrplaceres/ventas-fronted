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
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { useSession } from "next-auth/react";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface Usuario {
  usuario: number | string;
  password: string;
  repite: string;
  rol: "propietario" | "superadmin";
  nombre: string;
  email: string | null;
  activo: boolean;
}

function FormUsuario() {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { data: session, update } = useSession();

  const [usuario, setUsuario] = useState<Usuario>({
    usuario: "",
    password: "",
    repite: "",
    rol: "propietario",
    nombre: "",
    email: "",
    activo: true,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword: any = () => setShowPassword((show) => !show);

  const handleChange = ({ target: { name, value } }: any) => {
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
        rol: usuario.rol,
        nombre: usuario.nombre,
        email: usuario.email,
        activo: usuario.activo,
      };

      fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/user`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      })
        .then(function (response) {
          if (response.ok) {
            response.json().then((data) => {
              notificacion(`Se ha creado el usuario ${data.usuario}`, "info");
              setTimeout(() => router.push("/usuario"), 300);
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
            INSERTAR USUARIO
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
            inputProps={{
              pattern: "^[a-z0-9]+$",
              minLength: 3,
              maxLength: 24,
            }}
            helperText ="Sólo se permiten letras y números. Letras minúsculas. Entre 3 y 24 carácteres."
          />
          <TextField
            id="password"
            name="password"
            label="Contraseña"
            fullWidth
            value={usuario.password}
            onChange={handleChange}
            sx={{ mb: 1 }}
            type={showPassword ? "text" : "password"}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="repite"
            name="repite"
            label="Repite contraseña"
            fullWidth
            value={usuario.repite}
            onChange={handleChange}
            sx={{ mb: 1 }}
            type={showPassword ? "text" : "password"}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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

          <Box sx={{ textAlign: "center" }}>
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

function FormNuevoUsuario() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <FormUsuario />
    </SnackbarProvider>
  );
}

export default FormNuevoUsuario;
