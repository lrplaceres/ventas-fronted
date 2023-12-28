"use client";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Container,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { FormEvent, useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";
import Autocomplete from "@mui/material/Autocomplete";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";

interface Inventario {
  producto_id: number | string,
    cantidad: number,
    um: "LB" | "KG" | "Unidad" | "Quintal" | "Caja",
    costo: number,
    precio_venta: number,
    fecha: Date | Dayjs | null,
    negocio_id: number | string,
}

function FormInventario() {
  const router = useRouter();

  const params = useParams();

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const [inventario, setInventario] = useState<Inventario>({
    producto_id: "",
    cantidad: 0,
    um: "Unidad",
    costo: 0,
    precio_venta: 0,
    fecha: new Date(),
    negocio_id: "",
  });

  const [negocios, setNegocios] = useState([]);

  const [productos, setProductos] = useState([]);

  const [productoEdit, setProductoEdit] = useState([]);

  useEffect(() => {
    const obtenerNegociosPropietario = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/negocios`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
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

    const obtenerProductos = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/productos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
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

    obtenerNegociosPropietario();
    obtenerProductos();
    if (params?.id) {
      const obtenerInventario = async (id: any) => {
        await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/inventario/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
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
      
      obtenerInventario(params?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (productos.length > 0) {
      setProductoEdit(
        productos.filter((v:any) => v.id == inventario.producto_id)[0]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productos]);

  const handleChange = ({ target: { name, value } } : any) => {
    setInventario({ ...inventario, [name]: value });
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (params?.id) {
        fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/inventario/${params?.id}`, {
          method: "PUT",
          body: JSON.stringify(inventario),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
        })
          .then(function (response) {
            if (response.ok) {
              response.json().then((data) => {
                notificacion(`Se ha editado el Inventario`, "info");
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
        fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/inventario`, {
          method: "POST",
          body: JSON.stringify(inventario),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
        })
          .then(function (response) {
            if (response.ok) {
              response.json().then((data) => {
                notificacion(`Se ha creado el Inventario`, "info");
                setTimeout(() => router.push("/inventario"), 300);
              });
            } else {
              response.json().then((data) => {
                notificacion(`${data.detail}`);
              });
            }
          })
          .catch(function (error: any) {
            notificacion("Se ha producido un error");
          });
      }
    } catch (error: any) {
      return notificacion(error);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" color="primary" align="center">
            {params?.id ? "EDITAR" : "INSERTAR"} INVENTARIO
          </Typography>

          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={productos}
            getOptionLabel={(option:any) => `${option.nombre}`}
            sx={{ mb: 1 }}
            value={params?.id ? productoEdit : productos[0]}
            onChange={(event: any, newValue: any | null) => {
              if (!!newValue) {
                setInventario({
                  ...inventario,
                  producto_id: newValue.id,
                  negocio_id: newValue.negocio_id,
                });
              } else {
                setInventario({
                  ...inventario,
                  producto_id: "",
                  negocio_id: "",
                });
                setProductoEdit([]);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Producto" required />
            )}
            disabled={productos.length > 0 ? false : true}
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
              <MenuItem value={"LB"}>LB</MenuItem>
              <MenuItem value={"KG"}>KG</MenuItem>
              <MenuItem value={"Unidad"}>Unidad</MenuItem>
              <MenuItem value={"Quintal"}>Quintal</MenuItem>
              <MenuItem value={"Caja"}>Caja</MenuItem>
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

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              label="Fecha"
              onChange={(newvalue) => {
                setInventario({ ...inventario, fecha: newvalue });
              }}
              format="YYYY-MM-DD"
              sx={{ mb: 1 }}
              value={dayjs(inventario.fecha)}
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
              {negocios.length > 0 &&
                negocios.map((negocio:any, index) => (
                  <MenuItem key={index.toString()} value={negocio.id}>
                    {negocio.nombre}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Button
              variant="contained"
              color="inherit"
              sx={{ mr: 1 }}
              onClick={() => router.push("/inventario")}
              startIcon={<CancelIcon />}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mr: 1 }}
              startIcon={<DoneIcon />}
            >
              Aceptar
            </Button>
          </Box>
         
        </form>
        
      </Container>
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
