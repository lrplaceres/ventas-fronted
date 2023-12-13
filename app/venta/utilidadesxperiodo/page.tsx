"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import VistasMenu from "../_components/VistasMenuVenta";
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
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";
import { Box, Container } from "@mui/material";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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
  {
    field: "utilidad",
    headerName: "Utilidad",
    width: 120,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
  { field: "nombre_punto", headerName: "Punto", width: 120 },
  {
    field: "precio_costo",
    headerName: "Costo",
    width: 120,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: "monto",
    headerName: "Monto",
    width: 120,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: "precio_inventario",
    headerName: "Precio Inv",
    width: 140,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: "utilidad_esperada",
    headerName: "U. Esperada",
    width: 140,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: "diferencia_utilidad",
    headerName: "Dif",
    width: 120,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Utilidades por período",
    description: "",
    children: [
      { field: "nombre_producto" },
      { field: "utilidad" },
      { field: "nombre_punto" },
      { field: "precio_costo" },
      { field: "cantidad" },
    ],
  },
];

function Page() {
  const { data: session, update } = useSession();

  const [ventas, setVentas] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      diferencia_utilidad: false,
      monto: false,
      precio_inventario: false,
      utilidad_esperada: false,
      precio_costo: false,
    });

  const [fechas, setFechas] = useState({
    fecha_inicio: dayjs(new Date()).subtract(7, "day").format("YYYY-MM-DD"),
    fecha_fin: dayjs(new Date()).format("YYYY-MM-DD"),
  });

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  useEffect(() => {
    obtenerVentasPeriodo(fechas.fecha_inicio, fechas.fecha_fin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obtenerVentasPeriodo = async (fecha_inicio: Date, fecha_fin: Date) => {
    if (fecha_inicio > fecha_fin) {
      setVentas([]);
      return notificacion("La fecha fin debe ser mayor que la fecha inicio");
    }
    await fetch(
      `${process.env.MI_API_BACKEND}/ventas-utilidades-periodo/${fecha_inicio}/${fecha_fin}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session?.token_type} ${session?.access_token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setVentas(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  return (
    <>
    <Container maxWidth="md">      
      <div style={{ display: "flex", marginTop: 10, marginBottom: 10 }}>
        <div style={{ flexGrow: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              label="Fecha inicio"
              onChange={(newvalue) => {
                obtenerVentasPeriodo(
                  newvalue?.format("YYYY-MM-DD"),
                  fechas.fecha_fin
                );
                setFechas({
                  ...fechas,
                  fecha_inicio: newvalue.format("YYYY-MM-DD"),
                });
              }}
              format="YYYY-MM-DD"
              defaultValue={dayjs(new Date()).subtract(7, "day")}
              sx={{ mb: 1 }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              label="Fecha fin"
              onChange={(newvalue) => {
                obtenerVentasPeriodo(
                  fechas.fecha_inicio,
                  newvalue?.format("YYYY-MM-DD")
                );
                setFechas({
                  ...fechas,
                  fecha_fin: newvalue.format("YYYY-MM-DD"),
                });
              }}
              format="YYYY-MM-DD"
              defaultValue={dayjs(new Date())}
            />
          </LocalizationProvider>
        </div>

        <VistasMenu />
      </div>

      <Box sx={{height: "69vh", width:"100%"}}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={ventas}
          columns={columns}
          checkboxSelection
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibilityModel(newModel)
          }
          experimentalFeatures={{ columnGrouping: true }}
          columnGroupingModel={columnGroupingModel}
          sx={{
            border: 0,
          }}
        />
      </Box>
    </Container>
    </>
  );
}

function PageUtilidadesxperiodo() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageUtilidadesxperiodo;
