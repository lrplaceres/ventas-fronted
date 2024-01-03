"use client";
import {
  DataGrid,
  GridColDef,
  esES,
  GridColumnVisibilityModel,
  GridColumnGroupingModel,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import BotonInsertar from "./_components/BotonInsertar";
import VistasMenuVenta from "./_components/VistasMenuVenta";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Container } from "@mui/material";
import { darken, lighten, styled } from "@mui/material/styles";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { GridToolbarExport } from "@mui/x-data-grid";
import { grey } from "@mui/material/colors";
import CreditCardIcon from "@mui/icons-material/CreditCard";

const getBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.7) : lighten(color, 0.7);

const getHoverBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.6) : lighten(color, 0.6);

const getSelectedBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.5) : lighten(color, 0.5);

const getSelectedHoverBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.4) : lighten(color, 0.4);

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .pago-diferido--true": {
    backgroundColor: getBackgroundColor(grey[400], theme.palette.mode),
    "&:hover": {
      backgroundColor: getHoverBackgroundColor(grey[500], theme.palette.mode),
    },
    "&.Mui-selected": {
      backgroundColor: getSelectedBackgroundColor(
        grey[600],
        theme.palette.mode
      ),
      "&:hover": {
        backgroundColor: getSelectedHoverBackgroundColor(
          grey[700],
          theme.palette.mode
        ),
      },
    },
  },
}));

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const currencyFormatterCount = new Intl.NumberFormat("en-US");

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
      field: "nombre_producto",
      headerName: "Nombre",
      width: 160,
      type: "string",
      renderCell: (params) => {
        if (params.row.pago_electronico) {
          return (
            <>
              <CreditCardIcon />{" "}
              <Link
                href={`/venta/${params.row.id}`}
                className="decoration-none"
              >
                {params.value}
              </Link>
            </>
          );
        } else {
          return (
            <Link href={`/venta/${params.row.id}`} className="decoration-none">
              {params.value}
            </Link>
          );
        }
      },
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
    { field: "nombre_punto", type: "string", headerName: "Punto", width: 120 },
    {
      field: "precio",
      headerName: "Precio",
      width: 120,
      type: "number",
      valueFormatter: ({ value }) => {
        if (!value) {
          return value;
        }
        return currencyFormatter.format(value);
      },
    },
    { field: "fecha", headerName: "Fecha", width: 180 },
    {
      field: "monto",
      headerName: "Monto",
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
      field: "dependiente",
      type: "string",
      headerName: "Dependiente",
      width: 150,
    },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params: any) => [
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
    {
      field: "pago_electronico",
      type: "boolean",
      headerName: "Pago electrónico",
      width: 80,
    },
    {
      field: "pago_diferido",
      type: "boolean",
      headerName: "Pago diferido",
      width: 80,
    },
    {
      field: "descripcion",
      type: "string",
      headerName: "Descripción",
      width: 180,
    },
  ];

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "Listado de ventas",
      description: "",
      children: [
        { field: "nombre_producto" },
        { field: "cantidad" },
      ],
    },
  ];

  const router = useRouter();

  const { data: session, update } = useSession();

  const [ventas, setVentas] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      monto: false,
      dependiente: false,
      pago_electronico: false,
      pago_diferido: false,
      descripcion: false,
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
    const obtenerVentas = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/ventas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setVentas(data);
        })
        .catch(function (error) {
          notificacion("Se ha producido un error");
        });
    };

    obtenerVentas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const eliminarVenta = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/venta/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then(function (response) {
        if (response.ok) {
          notificacion(`La venta se ha sido eliminado`, "info");
          setVentas(ventas.filter((venta: any) => venta.id != id));
          handleClose();
        } else {
          response.json().then((data) => {
            notificacion(`${data.detail}`);
          });
        }
      })
      .catch(function (error: any) {
        notificacion("Se ha producido un error");
      });
  };

  return (
    <>
      <Container maxWidth="lg">
        <div style={{ display: "flex" }}>
          <BotonInsertar />

          <VistasMenuVenta />
        </div>

        <Box sx={{ height: "88vh", width: "100%" }}>
          <StyledDataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={ventas}
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
            getRowClassName={(params) =>
              `pago-diferido--${params.row.pago_diferido}`
            }
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
          <DialogTitle id="alert-dialog-title">{"Eliminar venta"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Al confirmar esta acción <strong>se borrarán los datos</strong>{" "}
              relacionados.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={() => eliminarVenta(temp)} autoFocus color="error">
              Estoy de acuerdo
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

function PageVenta() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageVenta;
