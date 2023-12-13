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
import VistasMenuInventario from "../_components/VistasMenuInventario";
import { Box } from "@mui/material";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const currencyFormatterCount = new Intl.NumberFormat("en-US");

const columns: GridColDef[] = [
  { field: "nombre", headerName: "Producto", width: 160 },
  {
    field: "existencia",
    headerName: "Cant",
    width: 100,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatterCount.format(value);
    },
  },
  { field: "fecha", headerName: "Fecha", width: 140 },
  {
    field: "costo",
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
  { field: "nombre_negocio", headerName: "Negocio", width: 140 },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Existencia en almacén",
    description: "",
    children: [
      { field: "nombre" },
      { field: "existencia" },
      { field: "fecha" },
      { field: "costo" },
      { field: "nombre_negocio" },
    ],
  },
];

function Page() {
  const { data: session, update } = useSession();

  const [existencia, setExistencia] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      nombre_negocio: false,
    });

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  useEffect(() => {
    const obtenerExistencia = async () => {
      await fetch(`${process.env.MI_API_BACKEND}/inventarios-a-distribuir`, {
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

    obtenerExistencia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div style={{ display: "flex", marginTop: 10, marginBottom: 10 }}>
        <div style={{ flexGrow: 1 }}></div>

        <VistasMenuInventario />
      </div>

      <Box sx={{height: "81vh", width:"100%"}}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={existencia}
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
