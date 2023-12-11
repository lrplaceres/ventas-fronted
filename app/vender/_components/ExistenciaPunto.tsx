"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import "dayjs/locale/es";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import {
  DataGrid,
  esES,
  GridColDef,
  GridColumnGroupingModel,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";

const currencyFormatterCount = new Intl.NumberFormat("en-US");

const columns: GridColDef[] = [
  { field: "nombre_producto", headerName: "Producto", width: 160 },
  {
    field: "existencia",
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
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Existencia en punto",
    description: "",
    children: [
      { field: "nombre_producto" },
      { field: "existencia" },
      { field: "cantidad" },
    ],
  },
];

function Page() {
  const { data: session, update } = useSession();

  const [existencia, setExistencia] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  useEffect(() => {
    obtenerExistencia();
  }, []);

  const obtenerExistencia = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/distribuciones-venta-punto`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setExistencia(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  return (
    <>
      <Box sx={{ height: "87vh", width: "100%" }}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={existencia}
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

function Existencia() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default Existencia;
