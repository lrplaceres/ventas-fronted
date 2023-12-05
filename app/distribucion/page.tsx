"use client";
import {
  DataGrid,
  GridColDef,
  GridColumnGroupingModel,
  GridColumnVisibilityModel,
  esES,
} from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import BotonInsertar from "./_components/BotonInsertar";
import VistasMenuDistribucion from "./_components/VistasMenuDistribucion";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const currencyFormatterCount = new Intl.NumberFormat("en-US");

const columns: GridColDef[] = [
  {
    field: "producto_id",
    headerName: "Producto",
    width: 120,
    renderCell: (params) => (
      <Link href={`/distribucion/${params.row.id}`} className="decoration-none">
        {params.value}
      </Link>
    ),
  },
  {
    field: "cantidad",
    headerName: "Cant",
    width: 80,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatterCount.format(value);
    },
  },
  { field: "punto_id", headerName: "Punto", width: 90 },
  {
    field: "costo",
    headerName: "Costo",
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
  { field: "negocio_id", headerName: "Negocio", width: 100 },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Listado de distribuciones",
    description: "",
    children: [
      { field: "producto_id" },
      { field: "cantidad" },
      { field: "punto_id" },
      { field: "costo" },
      { field: "fecha" },
    ],
  },
];

function Page() {
  const router = useRouter();

  const { data: session, update } = useSession();

  const [distribucion, setDistribucion] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      negocio_id: false,
    });

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
    <div style={{display: "flex"}}>
      <BotonInsertar />
      <VistasMenuDistribucion />
    </div>

      <div style={{ height: 540, width: "100%" }}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={distribucion}
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
