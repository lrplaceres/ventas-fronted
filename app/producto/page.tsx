"use client";
import { Button } from "@mui/material";
import { DataGrid, GridColDef, esES } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
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
      <Link href={`/producto/${params.row.id}`} className="decoration-none">
        {params.value}
      </Link>
    ),
  },
  { field: "negocio_nombre", headerName: "Negocio", width: 150 },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'Listado de Productos',
    description: '',
    children: [{ field: 'nombre' },{ field: 'negocio_nombre' }],
  }
];

function Page() {
  const router = useRouter();

  const { data: session, update } = useSession();

  const [productos, setProductos] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    obtenerProductos();
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerProductos = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/productos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
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
        sx={{ mt:  1 , mb:  1  }}
        startIcon={<PostAddIcon />}
        onClick={() => router.push("/producto/nuevo")}
      >
        Insertar Producto
      </Button>

      <div style={{ height: 540, width: "100%" }}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={productos}
          columns={columns}
          checkboxSelection
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


function PageProducto() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageProducto;
