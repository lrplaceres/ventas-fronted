"use client";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

function FormNuevoProducto() {
  const router = useRouter();

  return (
    <>
      <form>
        <Typography variant="h6" color="primary" align="center">
          INSERTAR PRODUCTO
        </Typography>
        <TextField
          id="nombre"
          label="Nombre"
          //value={}
          //onChange={}
          fullWidth
          sx={{ mb: ".5rem" }}
        />

        <Button
          variant="contained"
          color="error"
          sx={{ mr: ".5rem" }}
          onClick={() => router.push("/producto")}
        >
          Cancelar
        </Button>
        <Button variant="contained" color="success">
          Aceptar
        </Button>
      </form>
    </>
  );
}

export default FormNuevoProducto;
