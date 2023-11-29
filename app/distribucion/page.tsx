"use client";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Button } from "@mui/material";
import { DataGrid, GridColDef, esES } from "@mui/x-data-grid";
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
    field: "producto_id",
    headerName: "Producto",
    width: 150,
    renderCell: (params) => (
      <Link href={`/distribucion/${params.row.id}`} className="decoration-none">
        {params.value}
      </Link>
    ),
  },
  {
    field: "costo",
    headerName: "Costo",
    width: 80,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: "cantidad",
    headerName: "Cantidad",
    width: 80,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatterCount.format(value);
    },
  },
  { field: "fecha", headerName: "Fecha", width: 100 },
  { field: "punto_id", headerName: "Punto", width: 90 },
  { field: "negocio_id", headerName: "Negocio", width: 100 },
];

function Page() {
  const router = useRouter();

  const { data: session, update } = useSession();

  const [distribucion, setDistribucion] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    obtenerDistribucion();
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerDistribucion = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/distribuciones`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDistribucion(data);
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
        startIcon={<LocalShippingIcon />}
        onClick={() => router.push("/distribucion/nuevo")}
      >
        Insertar distribución
      </Button>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={distribucion}
          columns={columns}
          checkboxSelection
        />
      </div>
    </>
  );
}

function PageDistribucion() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageDistribucion;