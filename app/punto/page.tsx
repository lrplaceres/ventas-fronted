"use client";
import { Box, Button, Container } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  esES,
  GridRowSelectionModel,
  GridColumnGroupingModel,
  GridActionsCellItem,
  GridToolbarContainer,
} from "@mui/x-data-grid";
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
import BotonInsertar from "./_components/BotonInsertar";
import { GridToolbarExport } from "@mui/x-data-grid";

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
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          key={`a${params.row.id}`}
          icon={<DeleteIcon color="error" />}
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

  const [puntos, setPuntos] = useState([]);

  const [seleccionados, setSeleccionados] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [temp, setTemp] = useState<any>(0);

  useEffect(() => {
    const obtenerPuntos = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/puntos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
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

    obtenerPuntos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const eliminarPunto = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/punto/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then(function (response) {
        if (response.ok) {
          notificacion(`El Punto ha sido eliminado`, "info");
          setPuntos(puntos.filter((punto: any) => punto.id != id));
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
        <BotonInsertar />

        <Box sx={{ height: "83vh", width: "100%" }}>
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={puntos}
            columns={columns}
            checkboxSelection
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={columnGroupingModel}
            onRowSelectionModelChange={(ids) => {
              const selectedRowsData = ids.map((id) =>
                puntos.find((row: any) => row.id === id)
              );
              console.log(selectedRowsData);
            }}
            sx={{
              border: 0,
            }}
            rowHeight={40}
            slots={{ toolbar: CustomToolbar }}
          />
        </Box>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Eliminar punto"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Al confirmar esta acción <strong>se borrarán los datos</strong>{" "}
              relacionados.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={() => eliminarPunto(temp)} autoFocus color="error">
              Estoy de acuerdo
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
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
