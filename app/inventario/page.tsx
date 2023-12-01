"use client";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridColumnGroupingModel, GridColumnVisibilityModel, esES } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const currencyFormatterCount = new Intl.NumberFormat("en-US");

const columns: GridColDef[] = [
  {
    field: "nombre",
    headerName: "Nombre",
    width: 120,
    renderCell: (params) => (
      <Link href={`/inventario/${params.row.id}`} className="decoration-none">
        {params.value}
      </Link>
    ),
  },
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
  { field: "negocio_id", headerName: "Negocio", width: 100 },
  {
    field: "costo",
    headerName: "$ Costo",
    width: 100,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: "precio_venta",
    headerName: "$ Venta",
    width: 90,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
  { field: "fecha", headerName: "Fecha", width: 100 },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'Listado de Inventarios',
    description: '',
    children: [{ field: 'nombre' },{ field: 'cantidad' },{ field: 'negocio_id' },{ field: 'costo' },{ field: 'precio_venta' }],
  }
];

function Page() {
  const router = useRouter();

  const { data: session, update } = useSession();

  const [inventarios, setInventarios] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      fecha: false,
      dependiente: false,
    });

  useEffect(() => {
    obtenerInventarios();
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerInventarios = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/inventarios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setInventarios(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        sx={{ mt: 1, mb: 1 }}
        startIcon={<LibraryAddIcon />}
        onClick={() => router.push("/inventario/nuevo")}
      >
        Insertar Inventario
      </Button>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={inventarios}
          columns={columns}
          checkboxSelection
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibilityModel(newModel)
          }
          experimentalFeatures={{ columnGrouping: true }}
          columnGroupingModel={columnGroupingModel}
        />
      </div>
    </>
  );
}

function PageInventario() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageInventario;
