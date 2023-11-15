"use client";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useRouter } from "next/navigation";

function FormNuevoInventario() {
  const router = useRouter();

  return (
    <>
      <form>
        <Typography variant="h6" color="primary" align="center">
          INSERTAR INVENTARIO
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
          label="Cantidad"
          //value={}
          //onChange={}
          fullWidth
          sx={{ mb: ".5rem" }}
        />

        <FormControl fullWidth sx={{ mb: ".5rem" }}>
          <InputLabel id="demo-simple-select-label">UM</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            //value={"unidad"}
            label="UM"
            //onChange={handleChange}
          >
            <MenuItem value={"libra"}>LB</MenuItem>
            <MenuItem value={"kilogramo"}>KG</MenuItem>
            <MenuItem value={"unidad"}>Unidad</MenuItem>
            <MenuItem value={"quintal"}>Quintal</MenuItem>
            <MenuItem value={"caja"}>Caja</MenuItem>
          </Select>
        </FormControl>

        <TextField
          id="costo"
          label="Costo"
          //value={}
          //onChange={}
          fullWidth
          sx={{ mb: ".5rem" }}
          type="number"
        />

        <TextField
          id=""
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
          onClick={() => router.push("/inventario")}
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

export default FormNuevoInventario;
