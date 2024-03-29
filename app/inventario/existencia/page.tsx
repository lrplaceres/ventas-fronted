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
import { Box, Container } from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { GridToolbarExport } from "@mui/x-data-grid";

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
  {
    field: "costo",
    headerName: "$.Costo",
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
    ],
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
      await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/inventarios-almacen`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
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
    <Container maxWidth="lg">      
      <div style={{ display: "flex", marginTop: 10, marginBottom: 5 }}>
        <div style={{ flexGrow: 1 }}></div>

        <VistasMenuInventario />
      </div>

      <Box sx={{ height: "87vh", width: "100%" }}>
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
          rowHeight={40}
          slots={{ toolbar: CustomToolbar }}
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
