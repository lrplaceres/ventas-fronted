"use client";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColumnGroupingModel,
  GridColumnVisibilityModel,
  GridToolbarContainer,
  GridToolbarExport,
  esES,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import BotonInsertar from "./_components/BotonInsertar";
import VistasMenuInventario from "./_components/VistasMenuInventario";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Container } from "@mui/material";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const currencyFormatterCount = new Intl.NumberFormat("en-US");

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Listado de Inventarios",
    description: "",
    children: [
      { field: "nombre" },
      { field: "cantidad" },
      { field: "negocio_id" },
      { field: "costo" },
      { field: "precio_venta" },
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
      width: 160,
      renderCell: (params) => (
        <Link href={`/inventario/${params.row.id}`} className="decoration-none">
          {params.value}
        </Link>
      ),
    },
    {
      field: "cantidad",
      headerName: "Cant",
      width: 100,
      type: "number",
      valueFormatter: ({ value }) => {
        if (!value) {
          return value;
        }
        return currencyFormatterCount.format(value);
      },
    },
    { field: "negocio_id", headerName: "Negocio", width: 140 },
    {
      field: "costo",
      headerName: "$.Costo",
      width: 120,
      type: "number",
      valueFormatter: ({ value }) => {
        if (!value) {
          return value;
        }
        return currencyFormatter.format(value);
      },
    },
    {
      field: "precio_venta",
      headerName: "$.Venta",
      width: 120,
      type: "number",
      valueFormatter: ({ value }) => {
        if (!value) {
          return value;
        }
        return currencyFormatter.format(value);
      },
    },
    { field: "fecha", headerName: "Fecha", width: 100 },
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

  const { data: session, update } = useSession();

  const [inventarios, setInventarios] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      fecha: false,
      dependiente: false,
      negocio_id: false,
    });

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [temp, setTemp] = useState<any>(0);

  useEffect(() => {
    const obtenerInventarios = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/inventarios`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setInventarios(data);
        })
        .catch(function (error) {
          notificacion("Se ha producido un error");
        });
    };
    
    obtenerInventarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  }; 

  const eliminarInventario = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/inventario/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then(function (response) {
        if (response.ok) {
          notificacion(`El Inventario ha sido eliminado`, "info");
          setInventarios(
            inventarios.filter((inventario:any) => inventario.id != id)
          );
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
        <div style={{ display: "flex" }}>
          <BotonInsertar />
          <VistasMenuInventario />
        </div>

        <Box sx={{height: "85vh", width:"100%"}}>
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={inventarios}
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

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Eliminar inventario"}
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
              onClick={() => eliminarInventario(temp)}
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

function PageInventario() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageInventario;
