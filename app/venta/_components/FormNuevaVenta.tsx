"use client";
import {
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { FormEvent, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";

function FormVenta() {
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
          sx={{ mb: 1 }}
          required
        />

        <TextField
          id="cantidad"
          name="cantidad"
          label="Cantidad"
          value={venta.cantidad}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 1 }}
          type="number"
          required
        />

        <TextField
          id="precio"
          name="precio"
          label="Precio"
          value={venta.cantidad}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 1 }}
          type="number"
          required
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={(newvalue) => {
              setVenta({ ...venta, fecha: newvalue });
            }}
            format="YYYY-MM-DD"
            sx={{ mb: 1 }}
            value={dayjs(moment(venta.fecha).utc().format("YYYY-MM-DD"))}
          />
        </LocalizationProvider>

        <FormControl fullWidth sx={{ mb: 1 }}>
          <InputLabel id="demo-simple-select-label">Punto</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="punto_id"
            label="Punto"
            //value={distribucion.punto_id}
            onChange={handleChange}
            required
            //inputProps={{ readOnly: puntos.length ? false : true }}
          >
            
              <MenuItem>
                #1
              </MenuItem>
           
          </Select>
        </FormControl>


        <Card variant="outlined" sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="warning"
            sx={{ mr: 1 }}
            onClick={() => router.push("/punto")}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            type="submit"
            sx={{ mr: 1 }}
          >
            Aceptar
          </Button>
        </Card>
      </form>
    </>
  );
}

function FormNuevaVenta() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <FormVenta />
    </SnackbarProvider>
  );
}

export default FormNuevaVenta;
