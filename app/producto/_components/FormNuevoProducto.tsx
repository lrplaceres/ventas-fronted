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
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";

function FormProducto() {
  const router = useRouter();

  const params = useParams();

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const [producto, setProducto] = useState({
    nombre: "",
    negocio_id: "",
  });

  const [negocios, setNegocios] = useState([]);

  useEffect(() => {
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

    obtenerNegociosPropietario();
    if (params?.id) {
      const obtenerProducto = async (id: number) => {
        await fetch(`${process.env.MI_API_BACKEND}/producto/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${session?.token_type} ${session?.access_token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setProducto(data);
          })
          .catch(function (error) {
            notificacion("Se ha producido un error");
          });
      };
      
      obtenerProducto(params?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = ({ target: { name, value } } : any) => {
    setProducto({ ...producto, [name]: value });
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (params?.id) {
        fetch(`${process.env.MI_API_BACKEND}/producto/${params.id}`, {
          method: "PUT",
          body: JSON.stringify(producto),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${session?.token_type} ${session?.access_token}`,
          },
        })
          .then(function (response) {
            if (response.ok) {
              response.json().then((data) => {
                notificacion(
                  `Se ha editado el Producto ${producto.nombre}`,
                  "info"
                );
                setTimeout(() => router.push("/producto"), 300);
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
        fetch(`${process.env.MI_API_BACKEND}/producto`, {
          method: "POST",
          body: JSON.stringify(producto),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${session?.token_type} ${session?.access_token}`,
          },
        })
          .then(function (response) {
            if (response.ok) {
              response.json().then((data) => {
                notificacion(
                  `Se ha creado el Producto ${producto.nombre}`,
                  "info"
                );
                setTimeout(() => router.push("/producto"), 300);
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

  return (
    <>
      <Container maxWidth="sm">
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
            sx={{ mb: 1 }}
            required
          />

          <FormControl fullWidth>
            <InputLabel>Negocio</InputLabel>
            <Select
              id="negocio_id"
              name="negocio_id"
              value={producto.negocio_id}
              label="Negocio"
              onChange={handleChange}
              sx={{ mb: 1 }}
              required
            >
              {negocios.length > 0 &&
                negocios.map((producto, index) => (
                  <MenuItem key={index.toString()} value={producto.id}>
                    {producto.nombre}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Button
              variant="contained"
              color="inherit"
              sx={{ mr: 1 }}
              onClick={() => router.push("/producto")}
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

function FormNuevoProducto() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <FormProducto />
    </SnackbarProvider>
  );
}

export default FormNuevoProducto;
