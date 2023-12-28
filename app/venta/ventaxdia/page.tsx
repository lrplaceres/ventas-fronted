"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import VistasMenu from "../_components/VistasMenuVenta";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import {
  DataGrid,
  esES,
  GridColDef,
  GridColumnGroupingModel,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Box, Button, Container } from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const currencyFormatterCount = new Intl.NumberFormat("en-US");

const columns: GridColDef[] = [
  { field: "nombre_producto", headerName: "Producto", width: 160 },
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
  { field: "nombre_punto", headerName: "Punto", width: 120 },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Listado de ventas por fecha",
    description: "",
    children: [
      { field: "nombre_producto" },
      { field: "nombre_punto" },
      { field: "cantidad" },
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
  const { data: session, update } = useSession();

  const [ventas, setVentas] = useState([]);

  const [fecha, setFecha] = useState<any>(dayjs(new Date()).format("YYYY-MM-DD"));

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  useEffect(() => {
    obtenerVentas(dayjs(new Date()).format("YYYY-MM-DD"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obtenerVentas = async (fecha: any) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/ventas-dia/${fecha}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setVentas(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  return (
    <>
      <Container maxWidth="md">
        <div style={{ display: "flex", marginTop: 10, marginBottom: 10 }}>
          <div style={{ flexGrow: 1 }}>
            <IconButton
              aria-label="filtericon"
              color="inherit"
              onClick={handleClickOpen}
            >
              <FilterAltIcon />
            </IconButton>
          </div>

          <VistasMenu />
        </div>

        <Box sx={{ height: "85vh", width: "100%" }}>
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={ventas}
            columns={columns}
            checkboxSelection
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
            {"Filtrar información"}
          </DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Fecha"
                onChange={(newvalue) => {
                  obtenerVentas(newvalue?.format("YYYY-MM-DD"));
                  setFecha(newvalue?.format("YYYY-MM-DD"));
                }}
                format="YYYY-MM-DD"
                value={dayjs(fecha)}
                sx={{mt: 1}}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

function PageVentaXDia() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageVentaXDia;
