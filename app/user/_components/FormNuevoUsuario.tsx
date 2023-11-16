"use client";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";

function FormUsuario() {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [usuario, setUsuario] = useState({
    usuario: "",
    contrasenna: "",
    repite: "",
    rol: "propietario",
    nombre: "",
    email: "",
  });

  const handleChange = ({ target: { name, value } }) => {
    setUsuario({ ...usuario, [name]: value });
  };

  const notificacion = (mensaje:string, variant: VariantType) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (usuario.contrasenna != usuario.repite) {
       return notificacion("Las contraseñas deben coincidir",'error');
      }
    } catch (error) {}
  };

  return (
    <>
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
            sx={{ mb: ".5rem" }}
            required
          />
          <TextField
            id="contrasenna"
            name="contrasenna"
            label="Contraseña"
            fullWidth
            value={usuario.contrasenna}
            onChange={handleChange}
            sx={{ mb: ".5rem" }}
            type="password"
            required
          />
          <TextField
            id="repite"
            name="repite"
            label="Repite contreseña"
            fullWidth
            value={usuario.repite}
            onChange={handleChange}
            sx={{ mb: ".5rem" }}
            type="password"
            required
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

          <Button
            variant="contained"
            color="error"
            sx={{ mr: ".5rem" }}
            onClick={() => router.push("/user")}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            type="submit"
          >
            Aceptar
          </Button>
        </form>
    </>
  );
}


 function FormNuevoUsuario() {
  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{horizontal: "right", vertical: "top"}}>
      <FormUsuario />
    </SnackbarProvider>
  );
}

export default FormNuevoUsuario;
