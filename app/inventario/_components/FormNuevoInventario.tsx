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

function FormInventario() {
  const router = useRouter();

  const params = useParams();

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [inventario, setInventario] = useState({
    producto_id: "",
    cantidad: "",
    um: "unidad",
    costo: "",
    precio_venta: "",
    fecha: new Date(),
    negocio_id: "",
  });

  const [negocios, setNegocios] = useState([]);

  const [productos, setProductos] = useState([]);

  const [productoEdit, setProductoEdit] = useState([]);

  useEffect(() => {
    obtenerNegociosPropietario();
    obtenerProductos();
    if (params?.id) {
      obtenerInventario(params?.id);
    }
  }, []);

  useEffect(() => {
    if (productos.length) {
      setProductoEdit(
        productos.filter((v) => v.id == inventario.producto_id)[0]
      );
    }
  }, [productos]);

  const handleChange = ({ target: { name, value } }) => {
    setInventario({ ...inventario, [name]: value });
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerProductos = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/productos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const obtenerNegociosPropietario = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/negocios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNegocios(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const obtenerInventario = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/inventario/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setInventario(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (params?.id) {
        fetch(`${process.env.MI_API_BACKEND}/inventario/${params?.id}`, {
          method: "PUT",
          body: JSON.stringify(inventario),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${session?.token_type} ${session?.access_token}`,
          },
        })
          .then(function (response) {
            if (response.ok) {
              response.json().then((data) => {
                notificacion(`Se ha editado el Inventario`, "success");
                setTimeout(() => router.push("/inventario"), 300);
              });
            } else {
              response.json().then((data) => {
                notificacion(`${data.detail}`);
              });
            }
          })
          .catch(function (error) {
            notificacion("Se ha producido un error");
          });
      } else {
        fetch(`${process.env.MI_API_BACKEND}/inventario`, {
          method: "POST",
          body: JSON.stringify(inventario),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${session?.token_type} ${session?.access_token}`,
          },
        })
          .then(function (response) {
            if (response.ok) {
              response.json().then((data) => {
                notificacion(`Se ha creado el Inventario`, "success");
                setTimeout(() => router.push("/inventario"), 300);
              });
            } else {
              response.json().then((data) => {
                notificacion(`${data.detail}`);
              });
            }
          })
          .catch(function (error) {
            notificacion("Se ha producido un error");
          });
      }
    } catch (error) {
      return notificacion(error);
    }
  };

  const eliminarInventario = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/inventario/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then(function (response) {
        if (response.ok) {
          notificacion(`El Inventario ha sido eliminado`, "success");
          setTimeout(() => router.push("/inventario"), 300);
        } else {
          response.json().then((data) => {
            notificacion(`${data.detail}`);
          });
        }
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" color="primary" align="center">
          {params?.id ? "EDITAR" : "INSERTAR"} INVENTARIO
        </Typography>

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={productos}
          getOptionLabel={(option) => `${option.nombre}`}
          sx={{ mb: 1 }}
          value={params?.id ? productoEdit : productos[0]}
          onChange={(event: any, newValue: string | null) => {
            if (!!newValue) {
              //TODO: arreglar, con cambia producto_id
              setInventario({ ...inventario, producto_id: newValue.id });
              setInventario({ ...inventario, negocio_id: newValue.negocio_id });
              setProductoEdit(newValue);
            } else {
              setInventario({ ...inventario, producto_id: "" });
              setInventario({ ...inventario, negocio_id: "" });
              setProductoEdit([]);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Producto" required />
          )}
          disabled={productos.length ? false : true}
        />

        <TextField
          id="cantidad"
          name="cantidad"
          label="Cantidad"
          value={inventario.cantidad}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 1 }}
          type="number"
          required
        />

        <FormControl fullWidth sx={{ mb: 1 }}>
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

        <TextField
          id="precio_venta"
          name="precio_venta"
          label="Precio de Venta"
          value={inventario.precio_venta}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 1 }}
          type="number"
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={(newvalue) => {
              setInventario({ ...inventario, fecha: newvalue });
            }}
            format="YYYY-MM-DD"
            sx={{ mb: 1 }}
            value={dayjs(moment(inventario.fecha).utc().format("YYYY-MM-DD"))}
          />
        </LocalizationProvider>

        <FormControl fullWidth>
          <InputLabel>Negocio</InputLabel>
          <Select
            id="negocio_id"
            name="negocio_id"
            value={inventario.negocio_id}
            label="Negocio"
            onChange={handleChange}
            sx={{ mb: 1 }}
            required
            inputProps={{ readOnly: true }}
          >
            {negocios.length &&
              negocios.map((negocio, index) => (
                <MenuItem key={index.toString()} value={negocio.id}>
                  {negocio.nombre}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Card variant="outlined" sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="warning"
            sx={{ mr: 1 }}
            onClick={() => router.push("/inventario")}
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

          {params?.id && (
            <Button variant="contained" color="error" onClick={handleClickOpen}>
              Eliminar
            </Button>
          )}
        </Card>
      </form>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Eliminar inventario"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Al confirmar esta acción <strong>se borrarán los datos</strong>{" "}
            relacionados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={() => eliminarInventario(params?.id)}
            autoFocus
            color="error"
          >
            Estoy de acuerdo
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function FormNuevoInventario() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <FormInventario />
    </SnackbarProvider>
  );
}

export default FormNuevoInventario;
