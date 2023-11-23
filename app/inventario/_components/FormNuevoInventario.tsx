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
import { FormEvent, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import moment from "moment";

function FormNuevoInventario() {
  const router = useRouter();

  const [inventario, setInventario] = useState({
    producto: "",
    cantidad: "",
    um: "unidad",
    costo: "",
    fecha: Date(),
  });

  const handleChange = ({ target: { name, value } }) => {
    setInventario({ ...inventario, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(inventario);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" color="primary" align="center">
          INSERTAR INVENTARIO
        </Typography>

        <TextField
          id="producto"
          name="producto"
          label="Producto"
          value={inventario.producto}
          onChange={handleChange}
          fullWidth
          sx={{ mb: ".5rem" }}
          required
        />

        <TextField
          id="cantidad"
          name="cantidad"
          label="Cantidad"
          value={inventario.cantidad}
          onChange={handleChange}
          fullWidth
          sx={{ mb: ".5rem" }}
          type="number"
          required
        />

        <FormControl fullWidth sx={{ mb: ".5rem" }}>
          <InputLabel id="demo-simple-select-label">UM</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="um"
            label="UM"
            value={inventario.um}
            onChange={handleChange}
            required
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
          name="costo"
          label="Costo"
          value={inventario.costo}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 1 }}
          type="number"
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={(newvalue) => {
              setInventario({ ...inventario, "fecha": newvalue });
            }}
            format="YYYY-MM-DD"
            sx={{ mb: 1 }}
            value={dayjs(moment(inventario.fecha).utc().format("YYYY-MM-DD"))}
          />
        </LocalizationProvider>

        <Button
          variant="contained"
          color="error"
          sx={{ mr: ".5rem" }}
          onClick={() => router.push("/inventario")}
        >
          Cancelar
        </Button>
        <Button variant="contained" color="success" type="submit">
          Aceptar
        </Button>
      </form>
    </>
  );
}

export default FormNuevoInventario;
