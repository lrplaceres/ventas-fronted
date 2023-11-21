"use client";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import { Button, Card, FormControlLabel } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";

function FormKiosko() {
  const router = useRouter();

  const params = useParams();

  const { enqueueSnackbar } = useSnackbar();

  const [kiosko, setKiosko] = useState({
    nombre: "",
    representante: "",
    activo: true,
    admin_id: "",
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
      obtenerKiosko(params?.id);
  }}, []);

  useEffect(() => {
    setPropietarioEdit(propietarios.filter((v) => v.id == kiosko.admin_id)[0]);
  }, [propietarios]);

  const handleChange = ({ target: { name, value } }) => {
    setKiosko({ ...kiosko, [name]: value });
  };

  const handleChangeSlider = ({ target: { name, checked } }) => {
    setKiosko({ ...kiosko, [name]: checked });
  };

  const notificacion = (mensaje: string, variant: VariantType) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerKiosko = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/kiosko/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setKiosko(data);
      });
  };

  const obtenerPropietarios = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/user/propietarios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPropietarios(data);
      });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (params?.id) {
        fetch(`${process.env.MI_API_BACKEND}/kiosko/${params.id}`, {
          method: "PUT",
          body: JSON.stringify(kiosko),
          headers: {
            "Content-Type": "application/json",
          },
        }).then(function (response) {
          if (response.ok) {
            notificacion(`Se ha editato el Kiosko ${kiosko.nombre}`, "success");
            setTimeout(() => router.push("/kiosko"), 300);
          } else {
            notificacion(
              `Se ha producido un error ${response.status}`,
              "error"
            );
          }
        });
      } else {
        fetch(`${process.env.MI_API_BACKEND}/kiosko`, {
          method: "POST",
          body: JSON.stringify(kiosko),
          headers: {
            "Content-Type": "application/json",
          },
        }).then(function (response) {
          if (response.ok) {
            response.json().then((data) => {
              notificacion(
                `Se ha creado el Kiosko ${kiosko.nombre}`,
                "success"
              );
              setTimeout(() => router.push("/kiosko"), 300);
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

  const eliminarKiosko = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/kiosko/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(function (response) {
      if (!response.ok) {
        return notificacion("Se ha producido un error", "error");
      }

      notificacion(`El kiosko ${kiosko.nombre} ha sido eliminado`, "success");
      setTimeout(() => router.push("/kiosko"), 300);
    });
  };


  return (
    <>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" color="primary" align="center">
          {params.id ? "EDITAR" : "INSERTAR"} KIOSKO
        </Typography>

        <TextField
          id="nombre"
          name="nombre"
          label="Nombre"
          value={kiosko.nombre}
          onChange={handleChange}
          fullWidth
          sx={{ mb: ".5rem" }}
          required
        />

        <TextField
          id="representante"
          name="representante"
          label="Representante"
          value={kiosko.representante}
          onChange={handleChange}
          fullWidth
          sx={{ mb: ".5rem" }}
          required
        />

        <FormControlLabel
          control={
            <Switch
              name="activo"
              onChange={handleChangeSlider}
              checked={kiosko.activo}
            />
          }
          label="Activo"
          sx={{ mb: ".5rem" }}
        />

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={propietarios}
          getOptionLabel={(option) => `${option.nombre} ► ${option.usuario}`}
          sx={{ mb: 1 }}
          value={params.id ? propietarioEdit: propietarios[0]}
          onChange={(event: any, newValue: string | null) => {
            setKiosko({ ...kiosko, admin_id: newValue.id });
            setPropietarioEdit(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Propietario" required />
          )}
        />

        <Card variant="outlined" sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="warning"
            sx={{ mr: ".5rem" }}
            onClick={() => router.push("/kiosko")}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            type="submit"
            sx={{ mr: ".5rem" }}
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

function FormNuevoKiosko() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <FormKiosko />
    </SnackbarProvider>
  );
}

export default FormNuevoKiosko;
