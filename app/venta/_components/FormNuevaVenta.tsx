'use client'
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

function FormNuevaVenta() {
    const router =  useRouter();
  return (
    <>
      <form>
        <Typography variant="h6" color="primary" align="center">
          INSERTAR VENTA
        </Typography>

        <TextField
          id="producto"
          label="Producto"
          //value={}
          //onChange={}
          fullWidth
          sx={{ mb: ".5rem" }}
        />

        <TextField
          id="cantidad"
          label="cantidad"
          //value={}
          //onChange={}
          fullWidth
          sx={{ mb: ".5rem" }}
        />

        <TextField
          id="fecha"
          label="Fecha"
          //value={}
          //onChange={}
          fullWidth
          sx={{ mb: ".5rem" }}
        />

        <Button
          variant="contained"
          color="error"
          sx={{ mr: ".5rem" }}
          onClick={() => router.push("/venta")}
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

export default FormNuevaVenta;
