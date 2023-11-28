"use client";
import { Button } from "@mui/material";
import { DataGrid, GridColDef, esES } from "@mui/x-data-grid";
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
      <Link href={`/negocio/${params.row.id}`} className="decoration-none">
        {params.row.activo ? params.value : <del>{params.value}</del>}
      </Link>
    ),
  },
  { field: "direccion", headerName: "Dirección", width: 150 },
  { field: "informacion", headerName: "Información", width: 150 },
];

function Page() {
  const router = useRouter();

  const { data: session, update } = useSession();

  const [negocios, setNegocios] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    obtenerNegocios();
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerNegocios = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/negocio`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNegocios(data);
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
        startIcon={<AddBusinessIcon />}
        onClick={() => router.push("/negocio/nuevo")}
      >
        Insertar Negocio
      </Button>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={negocios}
          columns={columns}
          checkboxSelection
        />
      </div>
    </>
  );
}


function PageNegocio() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageNegocio;
