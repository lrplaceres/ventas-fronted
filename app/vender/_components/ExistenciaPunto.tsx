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
  { field: "nombre_punto", type:"string", headerName: "Punto", width: 120 },
  {
    field: "precio_venta",
    type: "number",
    headerName: "Precio",
    width: 120,
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
  { field: "um", type:"string", headerName: "UM", width: 90 },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Existencia en punto",
    description: "",
    children: [
      { field: "nombre_producto" },
      { field: "existencia" },
      { field: "nombre_punto" },
    ],
  },
];

function Page() {
  const { data: session, update } = useSession();

  const [existencia, setExistencia] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      nombre_punto: false,
    });

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  useEffect(() => {
    const obtenerExistencia = async () => {
      await fetch(
        `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/distribuciones-venta-punto-existencia`,
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
          setExistencia(data);
        })
        .catch(function (error) {
          notificacion("Se ha producido un error");
        });
    };

    obtenerExistencia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container maxWidth="lg">
        <Box sx={{ height: "93vh", width: "100%" }}>
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={existencia}
            columns={columns}
            checkboxSelection
            columnVisibilityModel={columnVisibilityModel}
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={columnGroupingModel}
            sx={{
              border: 0,
            }}
            rowHeight={40}
          />
        </Box>
      </Container>
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
