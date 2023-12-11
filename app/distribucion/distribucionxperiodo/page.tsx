"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import {
  DataGrid,
  esES,
  GridColDef,
  GridColumnGroupingModel,
} from "@mui/x-data-grid";
import VistasMenuDistribucion from "../_components/VistasMenuDistribucion";
import { Box } from "@mui/material";

const currencyFormatterCount = new Intl.NumberFormat("en-US");

const columns: GridColDef[] = [
  { field: "nombre_producto", headerName: "Producto", width: 160 },
  {
    field: "cantidad",
    headerName: "Cant",
    width: 120,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatterCount.format(value);
    },
  },
  { field: "nombre_punto", headerName: "Punto", width: 120 },
  { field: "nombre_negocio", headerName: "Negocio", width: 140 },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Distribuciones por período",
    description: "",
    children: [
      { field: "nombre_producto" },
      { field: "nombre_punto" },
      { field: "cantidad" },
      { field: "nombre_negocio" },
    ],
  },
];

function Page() {
  const { data: session, update } = useSession();

  const [distribuciones, setDistribuciones] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [fechas, setFechas] = useState({
    fecha_inicio: dayjs(new Date()).subtract(7, "day").format("YYYY-MM-DD"),
    fecha_fin: dayjs(new Date()).format("YYYY-MM-DD"),
  })

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  useEffect(() => {
    obtenerDistribucionesPeriodo(fechas.fecha_inicio, fechas.fecha_fin);
  }, []);

  const obtenerDistribucionesPeriodo = async (fecha_inicio: Date,fecha_fin: Date) => {
    if(fecha_inicio > fecha_fin){
      setDistribuciones([])
      return notificacion("La fecha fin debe ser mayor que la fecha inicio")
    }
    await fetch(`${process.env.MI_API_BACKEND}/distribuciones-periodo/${fecha_inicio}/${fecha_fin}`, {
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

  return (
    <>
      <div style={{ display: "flex", marginTop: 10, marginBottom: 10 }}>
        <div style={{ flexGrow: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              label="Fecha inicio"
              onChange={(newvalue) => {
                obtenerDistribucionesPeriodo(newvalue?.format("YYYY-MM-DD"), fechas.fecha_fin);
                setFechas({ ...fechas, fecha_inicio: newvalue.format("YYYY-MM-DD") });
              }}
              format="YYYY-MM-DD"
              defaultValue={dayjs(new Date()).subtract(7, "day")}              
              sx={{mb: 1}}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              label="Fecha fin"
              onChange={(newvalue) => {
                obtenerDistribucionesPeriodo(fechas.fecha_inicio, newvalue?.format("YYYY-MM-DD"));
                setFechas({ ...fechas, fecha_fin: newvalue.format("YYYY-MM-DD") });
              }}
              format="YYYY-MM-DD"
              defaultValue={dayjs(new Date())}
            />
          </LocalizationProvider>
        </div>

        <VistasMenuDistribucion />
      </div>

      <Box sx={{height: "69vh", width:"100%"}}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={distribuciones}
          columns={columns}
          checkboxSelection
          experimentalFeatures={{ columnGrouping: true }}
          columnGroupingModel={columnGroupingModel}
          sx={{
            border: 0,
          }}
        />
      </Box>
    </>
  );
}

function PageVentaXPeriodo() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageVentaXPeriodo;
