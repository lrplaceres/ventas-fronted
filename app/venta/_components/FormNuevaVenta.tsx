"use client";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import moment from "moment";
import { FormEvent, useState } from "react";

function FormNuevaVenta() {
  const router = useRouter();

  const [venta, setVenta] = useState({
    inventario: "",
    cantidad: "",
    fecha: Date(),
  });

  const handleChange = ({ target: { name, value } }) => {
    setVenta({ ...venta, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(venta);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>

        <Typography variant="h6" color="primary" align="center">
          INSERTAR VENTA
        </Typography>

        <TextField
          id="inventario"
          name="inventario"
          label="Producto"
          value={venta.inventario}
          onChange={handleChange}
          fullWidth
          sx={{ mb: ".5rem" }}
          required
        />

        <TextField
          id="cantidad"
          name="cantidad"
          label="cantidad"
          value={venta.cantidad}
          onChange={handleChange}
          fullWidth
          sx={{ mb: ".5rem" }}
          type="number"
          required
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={(newvalue) => {
              setVenta({ ...venta, "fecha": newvalue });
            }}
            format="YYYY-MM-DD"
            sx={{ mb: ".5rem" }}
            value={dayjs(moment(venta.fecha).utc().format("YYYY-MM-DD"))}
          />
        </LocalizationProvider>

        <Button
          variant="contained"
          color="error"
          sx={{ mr: ".5rem" }}
          onClick={() => router.push("/venta")}
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

export default FormNuevaVenta;
