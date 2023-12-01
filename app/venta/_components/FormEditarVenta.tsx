"use client";
import { Box, Button, TextField, Typography } from "@mui/material";
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
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function FormVenta() {
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

  const [venta, setVenta] = useState({
    distribucion_id: "",
    cantidad: "",
    precio: "",
    fecha: new Date(),
    punto_id: "",
  });

  const [distribuciones, setDistribuciones] = useState([]);

  const [distribucionEdit, setDistribucionEdit] = useState([]);

  useEffect(() => {
    obtenerDistribuciones();
    if (params?.id) {
      obtenerVenta(params?.id);
    }
  }, []);

  useEffect(() => {
    setDistribucionEdit(
      distribuciones.filter((v) => v.id == venta.distribucion_id)[0]
    );
  }, [distribuciones]);

  const handleChange = ({ target: { name, value } }) => {
    setVenta({ ...venta, [name]: value });
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerDistribuciones = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/distribuciones-venta`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDistribuciones(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const obtenerVenta = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/venta/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setVenta(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      fetch(`${process.env.MI_API_BACKEND}/venta/${params?.id}`, {
        method: "PUT",
        body: JSON.stringify(venta),
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session?.token_type} ${session?.access_token}`,
        },
      })
        .then(function (response) {
          if (response.ok) {
            response.json().then((data) => {
              notificacion(`Se ha editado la venta`, "success");
              setTimeout(() => router.push("/venta"), 300);
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
    } catch (error) {
      return notificacion(error);
    }
  };

  const eliminarVenta = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/venta/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then(function (response) {
        if (response.ok) {
          notificacion(`La venta se ha sido eliminado`, "success");
          setTimeout(() => router.push("/venta"), 300);
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
          INSERTAR VENTA
        </Typography>

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={distribuciones}
          getOptionLabel={(option) =>
            `${option.nombre_producto} ► ${option.nombre_punto} ► \ud83d\udcc5${option.fecha}`
          }
          sx={{ mb: 1 }}
          value={params?.id ? distribucionEdit : distribuciones[0]}
          onChange={(event: any, newValue: string | null) => {
            if (!!newValue) {
              setVenta({
                ...venta,
                distribucion_id: newValue.id,
                punto_id: newValue.punto_id,
                precio: newValue.precio_venta,
              });
            } else {
              setVenta({
                ...venta,
                distribucion_id: "",
                punto_id: "",
                precio: "",
                cantidad: "",
              });
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Producto" required />
          )}
          disabled={
            (distribuciones.length > 0 ? false : true) ||
            (params?.id ? true : false)
          }
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
          value={venta.precio}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 1 }}
          type="number"
          required
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Fecha"
            onChange={(newvalue) => {
              setVenta({ ...venta, fecha: newvalue });
            }}
            format="YYYY-MM-DD"
            sx={{ mb: 1 }}
            value={dayjs(moment(venta.fecha).utc().format("YYYY-MM-DD"))}
          />
        </LocalizationProvider>

        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Button
            variant="contained"
            color="warning"
            sx={{ mr: 1 }}
            onClick={() => router.push("/venta")}
            startIcon={<CancelIcon />}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            type="submit"
            sx={{ mr: 1 }}
            startIcon={<DoneIcon />}
          >
            Aceptar
          </Button>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          {params?.id && (
            <Button variant="contained" color="error" onClick={handleClickOpen} startIcon={<DeleteForeverIcon />}>
              Eliminar
            </Button>
          )}
        </Box>
      </form>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Eliminar venta"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Al confirmar esta acción <strong>se borrarán los datos</strong>{" "}
            relacionados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={() => eliminarVenta(params?.id)}
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

function FormEditarVenta() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <FormVenta />
    </SnackbarProvider>
  );
}

export default FormEditarVenta;
