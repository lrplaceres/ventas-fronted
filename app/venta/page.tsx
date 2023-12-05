"use client";
import {
  DataGrid,
  GridColDef,
  esES,
  GridColumnVisibilityModel,
  GridColumnGroupingModel,
} from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import BotonInsertar from "./_components/BotonInsertar";
import VistasMenuVenta from "./_components/VistasMenuVenta";

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
  { field: "fecha", headerName: "Fecha", width: 120 },
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
  { field: "dependiente", headerName: "Dependiente", width: 150 },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Listado de ventas",
    description: "",
    children: [
      { field: "nombre_producto" },
      { field: "cantidad" },
      { field: "nombre_punto" },
      { field: "precio" },
      { field: "fecha" },
      { field: "monto" },
    ],
  },
];

function Page() {
  const router = useRouter();

  const { data: session, update } = useSession();

  const [ventas, setVentas] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      monto: false,
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
    <div style={{display: "flex"}}>
      <BotonInsertar />

      <VistasMenuVenta />
    </div>

      <div style={{ height: 540, width: "100%" }}>
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
