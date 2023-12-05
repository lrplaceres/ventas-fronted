"use client";
import { Button } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  esES,
  GridRowSelectionModel,
  GridColumnGroupingModel,
} from "@mui/x-data-grid";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";

const columns: GridColDef[] = [
  {
    field: "nombre",
    headerName: "Nombre",
    width: 150,
    renderCell: (params) => (
      <Link href={`/punto/${params.row.id}`} className="decoration-none">
        {params.value}
      </Link>
    ),
  },
  { field: "direccion", headerName: "Dirección", width: 150 },
  { field: "negocio_id", headerName: "Negocio", width: 150 },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Listado de Puntos",
    description: "",
    children: [
      { field: "nombre" },
      { field: "direccion" },
      { field: "negocio_id" },
    ],
  },
];

function Page() {
  const router = useRouter();

  const { data: session, update } = useSession();

  const [puntos, setPuntos] = useState([]);

  const [seleccionados, setSeleccionados] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  useEffect(() => {
    obtenerPuntos();
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerPuntos = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/puntos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPuntos(data);
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
        startIcon={<AddBusinessIcon />}
        onClick={() => router.push("/punto/nuevo")}
      >
        Insertar Punto
      </Button>

      <div style={{ height: 540, width: "100%" }}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={puntos}
          columns={columns}
          checkboxSelection
          experimentalFeatures={{ columnGrouping: true }}
          columnGroupingModel={columnGroupingModel}
          onRowSelectionModelChange={(ids) => {
            const selectedRowsData = ids.map((id) =>
              puntos.find((row) => row.id === id)
            );
            console.log(selectedRowsData);
          }}
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

function PagePunto() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PagePunto;
