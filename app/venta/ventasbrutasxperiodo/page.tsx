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
import VistasMenuVenta from "../_components/VistasMenuVenta";
import { Box, Container } from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { GridToolbarExport } from "@mui/x-data-grid";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const columns: GridColDef[] = [
  { field: "fecha", headerName: "Fecha", width: 140 },
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
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Listado de ventas por período",
    description: "",
    children: [{ field: "fecha" }, { field: "monto" }],
  },
];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport
        printOptions={{
          hideFooter: true,
          hideToolbar: true,
        }}
      />
    </GridToolbarContainer>
  );
}

function Page() {
  const { data: session, update } = useSession();

  const [ventas, setVentas] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

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

  const obtenerVentasPeriodo = async (fecha_inicio: any, fecha_fin: any) => {
    if (fecha_inicio > fecha_fin) {
      setVentas([]);
      return notificacion("La fecha fin debe ser mayor que la fecha inicio");
    }
    await fetch(
      `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/ventas-brutas-periodo/${fecha_inicio}/${fecha_fin}`,
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
                onChange={(newvalue:any) => {
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
                onChange={(newvalue:any) => {
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

          <VistasMenuVenta />
        </div>

        <Box sx={{ height: "69vh", width: "100%" }}>
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={ventas}
            columns={columns}
            checkboxSelection
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={columnGroupingModel}
            sx={{
              border: 0,
            }}
            rowHeight={40}
            slots={{ toolbar: CustomToolbar }}
          />
        </Box>
      </Container>
    </>
  );
}

function PageInversionPeriodo() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageInversionPeriodo;
