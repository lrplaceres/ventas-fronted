"use client";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import { Button, FormControlLabel, Container, Box } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import Autocomplete from "@mui/material/Autocomplete";
import { useSession } from "next-auth/react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";

interface Negocio {
  nombre: string;
  direccion: string;
  informacion: string;
  fecha_licencia: Date | Dayjs | null;
  activo: boolean;
  propietario_id: number | string;
}

function FormNegocio() {
  const router = useRouter();

  const params = useParams();

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const [negocio, setNegocio] = useState<Negocio>({
    nombre: "",
    direccion: "",
    informacion: "",
    fecha_licencia: new Date(),
    activo: true,
    propietario_id: "",
  });

  const [propietarios, setPropietarios] = useState([]);

  const [propietarioEdit, setPropietarioEdit] = useState([]);

  useEffect(() => {
    const obtenerPropietarios = async () => {
      await fetch(
        `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/users-propietarios`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setPropietarios(data);
        })
        .catch(function (error) {
          notificacion("Se ha producido un error");
        });
    };

    obtenerPropietarios();
    if (params?.id) {
      obtenerNegocio(params.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPropietarioEdit(
      propietarios.filter((v: any) => v.id == negocio.propietario_id)[0]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propietarios]);

  const handleChange = ({ target: { name, value } }: any) => {
    setNegocio({ ...negocio, [name]: value });
  };

  const handleChangeSlider = ({ target: { name, checked } }: any) => {
    setNegocio({ ...negocio, [name]: checked });
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerNegocio = async (id: any) => {
    await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/negocio/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNegocio(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (params?.id) {
        fetch(
          `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/negocio/${params?.id}`,
          {
            method: "PUT",
            body: JSON.stringify(negocio),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        )
          .then(function (response) {
            if (response.ok) {
              notificacion(
                `Se ha editato el Negocio ${negocio.nombre}`,
                "info"
              );
              setTimeout(() => router.push("/negocio"), 300);
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
        fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/negocio`, {
          method: "POST",
          body: JSON.stringify(negocio),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
        })
          .then(function (response) {
            if (response.ok) {
              response.json().then((data) => {
                notificacion(
                  `Se ha creado el Negocio ${negocio.nombre}`,
                  "info"
                );
                setTimeout(() => router.push("/negocio"), 300);
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
            multiline
            maxRows={2}
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
            multiline
            maxRows={3}
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
            getOptionLabel={(option: any) =>
              `${option.nombre} ► ${option.usuario}`
            }
            sx={{ mb: 1 }}
            value={params?.id ? propietarioEdit : propietarios[0]}
            onChange={(event: any, newValue: any | null) => {
              setNegocio({ ...negocio, propietario_id: newValue.id });
              setPropietarioEdit(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Propietario" required />
            )}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha licencia"
              onChange={(newvalue) => {
                setNegocio({ ...negocio, fecha_licencia: newvalue });
              }}
              format="YYYY-MM-DD"
              sx={{ mb: 1 }}
              value={dayjs(negocio.fecha_licencia)}
            />
          </LocalizationProvider>

          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Button
              variant="contained"
              color="inherit"
              sx={{ mr: 1 }}
              onClick={() => router.push("/negocio")}
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
