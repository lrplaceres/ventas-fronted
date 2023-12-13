"use client";
import { Box, Button, Container } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColumnGroupingModel,
  esES,
} from "@mui/x-data-grid";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Listado de negocios",
    description: "",
    children: [
      { field: "nombre" },
      { field: "direccion" },
      { field: "informacion" },
    ],
  },
];

function Page() {
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
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          key={`a${params.row.id}`}
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

  const { data: session, update } = useSession();

  const [negocios, setNegocios] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [temp, setTemp] = useState<any>(0);

  useEffect(() => {
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

    obtenerNegocios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };



  const eliminarNegocio = async (id: any) => {
    await fetch(`${process.env.MI_API_BACKEND}/negocio/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    }).then(function (response) {
      if (response.ok) {
        notificacion(`El Negocio ha sido eliminado`, "info");
        setNegocios(negocios.filter((negocio:any) => negocio.id != id));
        handleClose();
      } else {
        response.json().then((data) => {
          notificacion(`${data.detail}`);
        });
      }
    });
  };

  return (
    <>
      <Container maxWidth="md">
        <Button
          variant="contained"
          color="inherit"
          sx={{ mt: 1, mb: 1 }}
          startIcon={<AddBusinessIcon />}
          onClick={() => router.push("/negocio/nuevo")}
        >
          Insertar Negocio
        </Button>

        <Box sx={{height: "83vh", width:"100%"}}>
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={negocios}
            columns={columns}
            checkboxSelection
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={columnGroupingModel}
            sx={{
              border: 0,
            }}
          />
        </Box>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Eliminar negocio"}
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
              onClick={() => eliminarNegocio(temp)}
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
