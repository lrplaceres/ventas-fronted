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

function FormPunto() {
  const router = useRouter();

  const params = useParams();

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();  

  const [punto, setPunto] = useState({
    nombre: "",
    direccion: "",
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
      const obtenerPunto = async (id: number) => {
        await fetch(`${process.env.MI_API_BACKEND}/punto/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${session?.token_type} ${session?.access_token}`,
          },
        })
          .then(function (response) {
            if (response.ok) {
              var result = response.json();
              result.then((data) => {
                setPunto(data);
              });
            } else {
              notificacion("Revise los datos asignados");
            }
          })
          .catch(function (error) {
            notificacion("Se ha producido un error");
          });
      };

      obtenerPunto(params?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = ({ target: { name, value } } : any) => {
    setPunto({ ...punto, [name]: value });
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (params?.id) {
        fetch(`${process.env.MI_API_BACKEND}/punto/${params?.id}`, {
          method: "PUT",
          body: JSON.stringify(punto),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${session?.token_type} ${session?.access_token}`,
          },
        })
          .then(function (response) {
            if (response.ok) {
              response.json().then((data) => {
                notificacion(`Se ha editado el Punto ${punto.nombre}`, "info");
                setTimeout(() => router.push("/punto"), 300);
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
        fetch(`${process.env.MI_API_BACKEND}/punto`, {
          method: "POST",
          body: JSON.stringify(punto),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${session?.token_type} ${session?.access_token}`,
          },
        })
          .then(function (response) {
            if (response.ok) {
              response.json().then((data) => {
                notificacion(`Se ha creado el Punto ${punto.nombre}`, "info");
                setTimeout(() => router.push("/punto"), 300);
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
            {params?.id ? "EDITAR" : "INSERTAR"} PUNTO
          </Typography>

          <TextField
            id="nombre"
            name="nombre"
            label="Nombre"
            value={punto.nombre}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 1 }}
            required
          />

          <TextField
            id="direccion"
            name="direccion"
            label="Dirección"
            value={punto.direccion}
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
              value={punto.negocio_id}
              label="Negocio"
              onChange={handleChange}
              sx={{ mb: 1 }}
              required
            >
              {negocios.length > 0 &&
                negocios.map((negocio, index) => (
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
              onClick={() => router.push("/punto")}
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

function FormNuevoPunto() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <FormPunto />
    </SnackbarProvider>
  );
}

export default FormNuevoPunto;
