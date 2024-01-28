"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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
  GridSlotsComponentsProps,
} from "@mui/x-data-grid";
import VistasMenuInventario from "../_components/VistasMenuInventario";
import { Autocomplete, Box, Button, Container, TextField } from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { GridToolbarExport } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const currencyFormatterCount = new Intl.NumberFormat("en-US");

const columns: GridColDef[] = [
  { field: "nombre", headerName: "Producto", width: 140 },
  { field: "accion", headerName: "Acción", width: 140 },
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
  { field: "fecha", headerName: "Fecha", width: 140 },
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
  {
    field: "precio_venta",
    headerName: "P. Venta",
    width: 120,
    type: "number",
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Tarjeta del producto",
    description: "",
    children: [{ field: "nombre" }, { field: "accion" }],
  },
];

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    someCustomString: string;
    someCustomNumber: string;
  }
}

function CustomToolbar(
  props: NonNullable<GridSlotsComponentsProps["toolbar"]>
) {
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

  const [inversiones, setInversiones] = useState([]);

  const [productos, setProductos] = useState([]);

  const [producto, setProducto] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  const [fechas, setFechas] = useState({
    fecha_inicio: dayjs(new Date()).subtract(7, "day").format("YYYY-MM-DD"),
    fecha_fin: dayjs(new Date()).format("YYYY-MM-DD"),
  });

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
    const obtenerProductos = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/productos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setProductos(data);
        })
        .catch(function (error) {
          notificacion("Se ha producido un error");
        });
    };

    obtenerProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obtenerTarjeta = async (
    fecha_inicio: any,
    fecha_fin: any,
    producto: any
  ) => {
    handleClose();

    if (fecha_inicio > fecha_fin) {
      setInversiones([]);
      return notificacion("La fecha fin debe ser mayor que la fecha inicio");
    }

    if (!producto) {
      return notificacion("Seleccione un producto");
    }

    await fetch(
      `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/inventarios-tarjeta/${fecha_inicio}/${fecha_fin}/${producto}`,
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
        setInversiones(data);
      })
      .catch(function (error) {
        notificacion("Se ha producido un error");
      });
  };

  return (
    <>
      <Container maxWidth="lg">
        <div style={{ display: "flex", marginTop: 10, marginBottom: 5 }}>
          <div style={{ flexGrow: 1 }}>
            <IconButton
              aria-label="filtericon"
              color="inherit"
              onClick={handleClickOpen}
            >
              <FilterAltIcon sx={{ color: "red" }} />
            </IconButton>
          </div>

          <VistasMenuInventario />
        </div>

        <Box sx={{ height: "87vh", width: "100%" }}>
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={inversiones}
            columns={columns}
            checkboxSelection
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={columnGroupingModel}
            sx={{
              border: 0,
            }}
            rowHeight={40}
            slots={{
              toolbar: CustomToolbar,
            }}
          />
        </Box>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
        >
          <DialogTitle id="alert-dialog-title">
            {"Filtrar información"}
          </DialogTitle>

          <DialogContent>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={productos}
              getOptionLabel={(option: any) => `${option.nombre}`}
              sx={{ mb: 1, mt: 1 }}
              onChange={(event: any, newValue: any | null) => {
                if (!!newValue) {
                  setProducto(newValue.id);
                } else {
                  setProducto(0);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Producto" required />
              )}
              disabled={productos.length > 0 ? false : true}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Fecha inicio"
                onChange={(newvalue: any) => {
                  setFechas({
                    ...fechas,
                    fecha_inicio: newvalue.format("YYYY-MM-DD"),
                  });
                }}
                format="YYYY-MM-DD"
                value={dayjs(fechas.fecha_inicio)}
                sx={{ mb: 1, mt: 1 }}
              />
            </LocalizationProvider>

            <br />

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Fecha fin"
                onChange={(newvalue: any) => {
                  setFechas({
                    ...fechas,
                    fecha_fin: newvalue.format("YYYY-MM-DD"),
                  });
                }}
                format="YYYY-MM-DD"
                value={dayjs(fechas.fecha_fin)}
                sx={{ mb: 1, mt: 1 }}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                obtenerTarjeta(fechas.fecha_inicio, fechas.fecha_fin, producto);
              }}
              autoFocus
            >
              BUSCAR
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

function PageTarjetaAlmacen() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageTarjetaAlmacen;
