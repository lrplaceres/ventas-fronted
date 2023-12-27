"use client";
import BotonInsertar from "./_components/BotonInsertar";
import { Box, Button, Container } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColumnGroupingModel,
  GridColumnVisibilityModel,
  GridToolbarExport,
  esES,
} from "@mui/x-data-grid";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";
import PasswordIcon from "@mui/icons-material/Password";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { GridToolbarContainer } from "@mui/x-data-grid";

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Listado de dependientes",
    description: "",
    children: [
      { field: "usuario" },
      { field: "punto_id" },
      { field: "nombre" },
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
  const columns: GridColDef[] = [
    {
      field: "usuario",
      headerName: "Usuario",
      width: 150,
      renderCell: (params) => (
        <Link href={`/dependiente/${params.row.id}`} className="decoration-none">
          {params.row.activo ? params.value : <del>{params.value}</del>}
        </Link>
      ),
    },
    { field: "punto_id", headerName: "Punto", width: 120 },
    { field: "nombre", headerName: "Nombre", width: 150 },
    { field: "email", headerName: "Correo", width: 150 },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          key={`a${params.row.id}`}
          icon={<PasswordIcon />}
          label="Cambiar contraseña"
          onClick={() => router.push(`/dependiente/cambiarpassword/${params.id}`)}
        />,
        <GridActionsCellItem
          key={`b${params.row.id}`}
          icon={<LockIcon />}
          label="Bloquear"
          onClick={() => bloquearUsuario(params?.id)}
          showInMenu
        />,
        <GridActionsCellItem
          key={`c${params.row.id}`}
          icon={<LockOpenIcon />}
          label="Desbloquear"
          onClick={() => desbloquearUsuario(params?.id)}
          showInMenu
        />,
        
      ],
    },
  ];

  const router = useRouter();

  const [dependientes, setDependientes] = useState([]);

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const [columnVisibilityModel, setColumnVisibilityModel] =
  useState<GridColumnVisibilityModel>({
    nombre: false,
    email: false,
  });

  useEffect(() => {
    const obtenerDependientes = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/dependientes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setDependientes(data);
        })
        .catch(function (error) {
          notificacion("Se ha producido un error");
        });
    };
    
    obtenerDependientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerDependientes = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/dependientes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDependientes(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const bloquearUsuario = async (id: any) => {
    await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/dependiente-bloquear/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then(function (response) {
        if (response.ok) {
          notificacion(`El dependiente ha sido bloqueado`, "info");
          obtenerDependientes();
        } else {
          response.json().then((data) => {
            notificacion(`${data.detail}`);
          });
        }
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  const desbloquearUsuario = async (id: any) => {
    await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/dependiente-desbloquear/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then(function (response) {
        if (response.ok) {
          notificacion(`El dependiente ha sido bloqueado`, "info");
          obtenerDependientes();
        } else {
          response.json().then((data) => {
            notificacion(`${data.detail}`);
          });
        }
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };
  
  return (
    <>
      <Container maxWidth="md">
        <BotonInsertar />

        <Box sx={{height: "83vh", width:"100%"}}>
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={dependientes}
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

function PageDependiente() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageDependiente;
