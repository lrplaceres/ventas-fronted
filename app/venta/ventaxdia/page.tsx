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
} from "@mui/x-data-grid";

const currencyFormatterCount = new Intl.NumberFormat("en-US");

const columns: GridColDef[] = [
  { field: "nombre_producto", headerName: "Producto", width: 150 },
  {
    field: "cantidad",
    headerName: "Cant",
    width: 60,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatterCount.format(value);
    },
  },
  { field: "nombre_punto", headerName: "Punto", width: 100 },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Listado de ventas por fecha",
    description: "",
    children: [
      { field: "nombre_producto" },
      { field: "nombre_punto" },
      { field: "cantidad" },
    ],
  },
];

function Page() {
  const { data: session, update } = useSession();

  const [ventas, setVentas] = useState([]);
 

  const { enqueueSnackbar } = useSnackbar();

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  useEffect(() => {
    obtenerVentas(dayjs(new Date()).format("YYYY-MM-DD"));
  }, []);

  const obtenerVentas = async (fecha: Date) => {
    await fetch(`${process.env.MI_API_BACKEND}/ventas-dia/${fecha}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
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
      <div style={{ display: "flex", marginTop: 10, marginBottom: 10 }}>
        <div style={{ flexGrow: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              label="Fecha"
              onChange={(newvalue) => {
                obtenerVentas(newvalue?.format("YYYY-MM-DD"));
              }}
              format="YYYY-MM-DD"
              defaultValue={dayjs(new Date())}
            />
          </LocalizationProvider>
        </div>

        <VistasMenu />
      </div>

      <div style={{ height: 515, width: "100%" }}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={ventas}
          columns={columns}
          checkboxSelection
          experimentalFeatures={{ columnGrouping: true }}
          columnGroupingModel={columnGroupingModel}
          sx={{
            border: 1,
            borderColor: "primary.main",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
        />
      </div>
    </>
  );
}

function PageVentaXDia() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageVentaXDia;