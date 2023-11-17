"use client";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function FormNuevoProducto() {
  const router = useRouter();

  const [producto, setProducto] = useState({
    nombre: "",
    kiosko_id: 4
  });

  const handleChange = ({ target: { name, value } }) => {
    setProducto({ ...producto, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(producto);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>

        <Typography variant="h6" color="primary" align="center">
          INSERTAR PRODUCTO
        </Typography>

        <TextField
          id="nombre"
          name="nombre"
          label="Nombre"
          value={producto.nombre}
          onChange={handleChange}
          fullWidth
          sx={{ mb: ".5rem" }}
          required
        />

        <Button
          variant="contained"
          color="error"
          sx={{ mr: ".5rem" }}
          onClick={() => router.push("/producto")}
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

export default FormNuevoProducto;
