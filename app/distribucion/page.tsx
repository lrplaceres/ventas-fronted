"use client";
import {
  DataGrid,
  GridActionsCellItem,
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
  const columns: GridColDef[] = [
    {
      field: "producto_id",
      headerName: "Producto",
      width: 160,
      renderCell: (params) => (
        <Link
          href={`/distribucion/${params.row.id}`}
          className="decoration-none"
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: "cantidad",
      headerName: "Cant",
      width: 120,
      type: "number",
      valueFormatter: ({ value }) => {
        if (!value) {
          return value;
        }
        return currencyFormatterCount.format(value);
      },
    },
    { field: "punto_id", headerName: "Punto", width: 120 },
    {
      field: "costo",
      headerName: "Costo",
      width: 120,
      type: "number",
      valueFormatter: ({ value }) => {
        if (!value) {
          return value;
        }
        return currencyFormatter.format(value);
      },
    },
    { field: "fecha", headerName: "Fecha", width: 140 },
    { field: "negocio_id", headerName: "Negocio", width: 140 },
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

  const [distribucion, setDistribucion] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      negocio_id: false,
    });

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [temp, setTemp] = useState(0);

  useEffect(() => {
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

    obtenerDistribucion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };
 
  const eliminarDistribucion = async (id: number) => {
    await fetch(`${process.env.MI_API_BACKEND}/distribucion/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then(function (response) {
        if (response.ok) {
          notificacion(`La distribución se ha sido eliminado`, "info");
          setDistribucion(distribucion.filter((dist) => dist.id != id));
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
          <VistasMenuDistribucion />
        </div>

        <Box sx={{height: "83vh", width:"100%"}}>
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
            {"Eliminar distribución"}
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
              onClick={() => eliminarDistribucion(temp)}
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
