"use client"
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/navigation";

function FormNuevoUsuario() {

  const router = useRouter();

  return (
    <>
      <form>
        <Typography variant="h6" color="primary" align="center" mb={2}>
          INSERTAR USUARIO
        </Typography>

        <TextField
          id="usuario"
          label="Usuario"
          fullWidth
          //value={}
          //onChange={}
          sx={{ mb: ".5rem" }}
        />
        <TextField
          id="contrasenna"
          label="Contraseña"
          fullWidth
          //value={}
          //onChange={}
          sx={{ mb: ".5rem" }}
          type="password"
        />
        <TextField
          id="repite"
          label="Repite contreseña"
          fullWidth
          //value={}
          //onChange={}
          sx={{ mb: ".5rem" }}
          type="password"
        />

        <FormControl fullWidth sx={{ mb: ".5rem" }}>
          <InputLabel id="demo-simple-select-label">Rol</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            //value={age}
            label="Rol"
            //onChange={handleChange}
          >
            <MenuItem value={"dependiente"}>Dependiente</MenuItem>
            <MenuItem value={"propietario"}>Propietario</MenuItem>
            <MenuItem value={"superadmin"}>Superadmin</MenuItem>
          </Select>
        </FormControl>

        <TextField
          id="nombre"
          label="Nombre"
          fullWidth
          //value={}
          //onChange={}
          sx={{ mb: ".5rem" }}
        />
        <TextField
          id="email"
          label="Correo electrónico"
          fullWidth
          //value={}
          //onChange={}
          sx={{ mb: ".5rem" }}
          type="email"
        />

        <Button variant="contained" color="error" sx={{ mr: ".5rem" }} onClick={()=>router.push("/user")}>
          Cancelar
        </Button>
        <Button variant="contained" color="success">
          Aceptar
        </Button>
      </form>
    </>
  );
}

export default FormNuevoUsuario;
