"use client";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Card, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { useSession } from "next-auth/react";

function FormUsuario() {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { data: session, update } = useSession();

  const [usuario, setUsuario] = useState({
    usuario: "",
    password: "",
    repite: "",
    rol: "propietario",
    nombre: "",
    email: "",
    activo: true,
  });

  const handleChange = ({ target: { name, value } }) => {
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

      fetch(`${process.env.MI_API_BACKEND}/user`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${session?.token_type} ${session?.access_token}`,
        },
      }).then(function (response) {
        if (response.ok) {
          response.json().then((data) => {
            notificacion(`Se ha creado el usuario ${data.usuario}`, "success");
            setTimeout(() => router.push("/usuario"), 300);
          });
        } else {
          notificacion(`Se ha producido un error ${response.status}`);
        }
      })
      .catch(function (error) {
        notificacion("Se ha producido un error")
      });
    } catch (error) {
      return notificacion(error);
    }
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
          sx={{ mb:  1  }}
          required
        />
        <TextField
          id="password"
          name="password"
          label="Contraseña"
          fullWidth
          value={usuario.password}
          onChange={handleChange}
          sx={{ mb:  1  }}
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
          sx={{ mb:  1  }}
          type="password"
          required
        />

        <FormControl fullWidth sx={{ mb:  1  }}>
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
          sx={{ mb:  1  }}
        />
        <TextField
          id="email"
          name="email"
          label="Correo electrónico"
          fullWidth
          value={usuario.email}
          onChange={handleChange}
          sx={{ mb:  1  }}
          type="email"
        />

        <Card variant="outlined" sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="warning"
            sx={{ mr:  1  }}
            onClick={() => router.push("/usuario")}
          >
            Cancelar
          </Button>
          <Button variant="contained" color="success" type="submit">
            Aceptar
          </Button>
        </Card>
      </form>
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
