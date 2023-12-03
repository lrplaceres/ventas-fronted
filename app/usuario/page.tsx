"use client";
import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridColumnGroupingModel, esES } from "@mui/x-data-grid";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";

const columns: GridColDef[] = [
  {
    field: "usuario",
    headerName: "Usuario",
    width: 150,
    renderCell: (params) => (
      <Link href={`/usuario/${params.row.id}`} className="decoration-none">
        {params.row.activo ? params.value : <del>{params.value}</del>}
      </Link>
    ),
  },
  { field: "rol", headerName: "Rol", width: 150 },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'Listado de usuarios',
    description: '',
    children: [{ field: 'usuario' },{ field: 'rol' }],
  }
];

function Page() {
  const router = useRouter();

  const [usuarios, setUsuarios] = useState([]);

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerUsuarios = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsuarios(data);
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
        startIcon={<PersonAddAlt1Icon />}
        onClick={() => router.push("/usuario/nuevo")}
      >
        Insertar Usuario
      </Button>

      <div style={{ height: 500, width: "100%" }}>

        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={usuarios}
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

function PageUsuario() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageUsuario;
