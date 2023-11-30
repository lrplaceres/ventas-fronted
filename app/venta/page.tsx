"use client";
import { Button } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  esES,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";
import AddShoppingCartIcon from "@mui/icons-material/AddBusiness";
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
    field: "nombre_producto",
    headerName: "Nombre",
    width: 120,
    renderCell: (params) => (
      <Link href={`/venta/${params.row.id}`} className="decoration-none">
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
  { field: "nombre_punto", headerName: "Punto", width: 100 },
  {
    field: "precio",
    headerName: "Precio",
    width: 90,
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
    width: 110,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
  { field: "fecha", headerName: "Fecha", width: 120 },
  { field: "dependiente", headerName: "Dependiente", width: 150 },
];

function Page() {
  const router = useRouter();

  const { data: session, update } = useSession();

  const [ventas, setVentas] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      fecha: false,
      dependiente: false,
    });

  useEffect(() => {
    obtenerVentas();
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerVentas = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/ventas`, {
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
      <Button
        variant="contained"
        color="inherit"
        sx={{ mt: 1, mb: 1 }}
        startIcon={<AddShoppingCartIcon />}
        onClick={() => router.push("/venta/nueva")}
      >
        Insertar Venta
      </Button>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={ventas}
          columns={columns}
          checkboxSelection
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibilityModel(newModel)
          }
        />
      </div>
    </>
  );
}

function PageVenta() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageVenta;
