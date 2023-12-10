"use client";
import { Button, Container } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColumnGroupingModel,
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

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Listado de usuarios",
    description: "",
    children: [{ field: "usuario" }, { field: "rol" }],
  },
];

function Page() {
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
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<PasswordIcon />}
          label="Camniar contraseña"
          onClick={() => router.push(`/usuario/cambiarpassword/${params.id}`)}
        />,
        <GridActionsCellItem
          icon={<LockIcon />}
          label="Bloquear"
          onClick={() => bloquearUsuario(params.id)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<LockOpenIcon />}
          label="Desbloquear"
          onClick={() => desbloquearUsuario(params.id)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color="error"/>}
          label="Eliminar"
          onClick={() => {
            handleClickOpen();
            setTemp(params.id);
          }}
          showInMenu
        />,
      ],
    },
  ];

  const router = useRouter();

  const [usuarios, setUsuarios] = useState([]);

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [temp, setTemp] = useState(0);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerUsuarios = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/users`, {
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

  const bloquearUsuario = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/users-bloquear/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then(function (response) {
        if (response.ok) {
          notificacion(`El usuario ha sido bloqueado`, "info");
          obtenerUsuarios();
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

  const desbloquearUsuario = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/users-desbloquear/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then(function (response) {
        if (response.ok) {
          notificacion(`El usuario ha sido bloqueado`, "info");
          obtenerUsuarios();
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

  const eliminarUsuario = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then(function (response) {
        if (response.ok) {
          notificacion(`El usuario ha sido eliminado`, "info");
          setUsuarios(usuarios.filter((usuario) => usuario.id != id));
          handleClose();
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
        <Button
          variant="contained"
          color="inherit"
          sx={{ mt: 1, mb: 1 }}
          startIcon={<PersonAddAlt1Icon />}
          onClick={() => router.push("/usuario/nuevo")}
        >
          Insertar Usuario
        </Button>

        <div style={{ height: 540, width: "100%" }}>
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

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" textAlign="center">
            {"Eliminar usuario"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Al confirmar esta acción <strong>se borrarán los datos</strong>{" "}
              relacionados.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button
              onClick={() => eliminarUsuario(temp)}
              autoFocus
              color="error"
            >
              Estoy de acuerdo
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
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
