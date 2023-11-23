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

function FormProducto() {
  const router = useRouter();

  const params = useParams();

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const [producto, setProducto] = useState({
    nombre: "",
    negocio_id: "",
  });

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [negocios, setNegocios] = useState([]);

  useEffect(() => {
    obtenerNegociosPropietario();
    if (params.id) {
      obtenerProducto(params.id);
    }
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setProducto({ ...producto, [name]: value });
  };

  const notificacion = (mensaje: string, variant: VariantType) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerNegociosPropietario = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/negocios/${session?.usuario}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNegocios(data);
      });
  };

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
      });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (params.id) {
        fetch(`${process.env.MI_API_BACKEND}/producto/${params.id}`, {
          method: "PUT",
          body: JSON.stringify(producto),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${session?.token_type} ${session?.access_token}`,
          },
        }).then(function (response) {
          if (response.ok) {
            response.json().then((data) => {
              notificacion(
                `Se ha editado el Producto ${producto.nombre}`,
                "success"
              );
              setTimeout(() => router.push("/producto"), 300);
            });
          } else {
            notificacion(
              `Se ha producido un error ${response.status}`,
              "error"
            );
          }
        });
      } else {
        fetch(`${process.env.MI_API_BACKEND}/producto`, {
          method: "POST",
          body: JSON.stringify(producto),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${session?.token_type} ${session?.access_token}`,
          },
        }).then(function (response) {
          if (response.ok) {
            response.json().then((data) => {
              notificacion(
                `Se ha creado el Producto ${producto.nombre}`,
                "success"
              );
              setTimeout(() => router.push("/producto"), 300);
            });
          } else {
            notificacion(
              `Se ha producido un error ${response.status}`,
              "error"
            );
          }
        });
      }
    } catch (error) {
      return notificacion(error, "error");
    }
  };

  const eliminarProducto = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/producto/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    }).then(function (response) {
      if (!response.ok) {
        return notificacion("Se ha producido un error", "error");
      }

      notificacion(
        `El Producto ${producto.nombre} ha sido eliminado`,
        "success"
      );
      setTimeout(() => router.push("/producto"), 300);
    });
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
            {negocios.map((producto, index) => (
              <MenuItem key={index.toString()} value={producto.id}>
                {producto.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Card variant="outlined" sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="error"
            sx={{ mr: 1 }}
            onClick={() => router.push("/producto")}
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
        <DialogTitle id="alert-dialog-title">{"Eliminar producto"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Al confirmar esta acción <strong>se borrarán los datos</strong>{" "}
            relacionados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={() => eliminarProducto(params?.id)}
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
