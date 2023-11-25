"use client";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import { Button, Card, FormControlLabel } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";
import { useSession } from "next-auth/react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import moment from "moment";

function FormNegocio() {
  const router = useRouter();

  const params = useParams();

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const [negocio, setNegocio] = useState({
    nombre: "",
    direccion: "",
    informacion: "",
    fecha_licencia: new Date(),
    activo: true,
    propietario_id: "",
  });

  const [propietarios, setPropietarios] = useState([]);

  const [propietarioEdit, setPropietarioEdit] = useState([]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    obtenerPropietarios();
    if (params?.id) {
      obtenerNegocio(params.id);
    }
  }, []);

  useEffect(() => {
    setPropietarioEdit(
      propietarios.filter((v) => v.id == negocio.propietario_id)[0]
    );
  }, [propietarios]);

  const handleChange = ({ target: { name, value } }) => {
    setNegocio({ ...negocio, [name]: value });
  };

  const handleChangeSlider = ({ target: { name, checked } }) => {
    setNegocio({ ...negocio, [name]: checked });
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerNegocio = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/negocio/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNegocio(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error")
      });
  };

  const obtenerPropietarios = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/user/propietarios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPropietarios(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error")
      });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (params?.id) {
        fetch(`${process.env.MI_API_BACKEND}/negocio/${params?.id}`, {
          method: "PUT",
          body: JSON.stringify(negocio),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${session?.token_type} ${session?.access_token}`,
          },
        }).then(function (response) {
          if (response.ok) {
            notificacion(
              `Se ha editato el Negocio ${negocio.nombre}`,
              "success"
            );
            setTimeout(() => router.push("/negocio"), 300);
          } else {
            notificacion(
              `Se ha producido un error ${response.status}`
            );
          }
        })
        .catch(function (error) {
          notificacion("Se ha producido un error")
        });
      } else {
        fetch(`${process.env.MI_API_BACKEND}/negocio`, {
          method: "POST",
          body: JSON.stringify(negocio),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${session?.token_type} ${session?.access_token}`,
          },
        }).then(function (response) {
          if (response.ok) {
            response.json().then((data) => {
              notificacion(
                `Se ha creado el Negocio ${negocio.nombre}`,
                "success"
              );
              setTimeout(() => router.push("/negocio"), 300);
            });
          } else {
            notificacion(
              `Se ha producido un error ${response.status}`
            );
          }
        })
        .catch(function (error) {
          notificacion("Se ha producido un error")
        });
      }
    } catch (error) {
      return notificacion(error);
    }
  };

  const eliminarKiosko = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/negocio/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    }).then(function (response) {
      if (!response.ok) {
        return notificacion("Se ha producido un error");
      }

      notificacion(`El Negocio ${negocio.nombre} ha sido eliminado`, "success");
      setTimeout(() => router.push("/negocio"), 300);
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" color="primary" align="center">
          {params?.id ? "EDITAR" : "INSERTAR"} NEGOCIO
        </Typography>

        <TextField
          id="nombre"
          name="nombre"
          label="Nombre"
          value={negocio.nombre}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 1 }}
          required
        />

        <TextField
          id="direccion"
          name="direccion"
          label="Dirección"
          value={negocio.direccion}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 1 }}
          required
        />

        <TextField
          id="informacion"
          name="informacion"
          label="Información"
          value={negocio.informacion}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 1 }}
          required
        />

        <FormControlLabel
          control={
            <Switch
              name="activo"
              onChange={handleChangeSlider}
              checked={negocio.activo}
            />
          }
          label="Activo"
          sx={{ mb: 1 }}
        />

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={propietarios}
          getOptionLabel={(option) => `${option.nombre} ► ${option.usuario}`}
          sx={{ mb: 1 }}
          value={params.id ? propietarioEdit : propietarios[0]}
          onChange={(event: any, newValue: string | null) => {
            setNegocio({ ...negocio, "propietario_id": newValue.id });
            setPropietarioEdit(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Propietario" required />
          )}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={(newvalue) => {
              setNegocio({ ...negocio, "fecha_licencia": newvalue });
            }}
            format="YYYY-MM-DD"
            sx={{ mb: 1 }}
            value={dayjs(moment(negocio.fecha_licencia).utc().format("YYYY-MM-DD"))}
          />
        </LocalizationProvider>

        <Card variant="outlined" sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="warning"
            sx={{ mr: 1 }}
            onClick={() => router.push("/negocio")}
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

          {params.id && (
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
        <DialogTitle id="alert-dialog-title">{"Eliminar kiosko"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Al confirmar esta acción <strong>se borrarán los datos</strong>{" "}
            relacionados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={() => eliminarKiosko(params.id)}
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

function FormNuevoNegocio() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <FormNegocio />
    </SnackbarProvider>
  );
}

export default FormNuevoNegocio;