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
} from "@mui/x-data-grid";
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { GridToolbarExport } from "@mui/x-data-grid";
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
    groupId: "Listado de ventas por período",
    description: "",
    children: [
      { field: "nombre_producto" },
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

  const { enqueueSnackbar } = useSnackbar();

  const [negocios, setNegocios] = useState([]);

  const [filtros, setFiltros] = useState({
    fecha_inicio: dayjs(new Date()).subtract(7, "day").format("YYYY-MM-DD"),
    fecha_fin: dayjs(new Date()).format("YYYY-MM-DD"),
    negocio: ""
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
    const obtenerNegociosPropietario = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/negocios`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
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

    obtenerNegociosPropietario();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obtenerVentasPeriodo = async (fecha_inicio: any, fecha_fin: any, negocio: any) => {
    handleClose();
    
    if (!filtros.negocio) {
      return notificacion("Seleccione un Negocio");
    }

    if (fecha_inicio > fecha_fin) {
      setVentas([]);
      return notificacion("La fecha fin debe ser mayor que la fecha inicio");
    }
    await fetch(
      `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/ventas-periodo/${fecha_inicio}/${fecha_fin}/${negocio}`,
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
      <Container maxWidth="lg">
        <div style={{ display: "flex", marginTop: 10, marginBottom: 5 }}>
          <div style={{ flexGrow: 1 }}>
            <IconButton
              aria-label="filtericon"
              color="inherit"
              onClick={handleClickOpen}
            >
              <FilterAltIcon sx={{color: "red"}}/>
            </IconButton>
          </div>

          <VistasMenu />
        </div>

        <Box sx={{ height: "87vh", width: "100%" }}>
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
          <FormControl fullWidth sx={{mt: 1}}>
            <InputLabel>Negocio</InputLabel>
            <Select
              id="negocio_id"
              name="negocio_id"
              value={filtros.negocio}
              label="Negocio"
              onChange={({target}: any) => {
                setFiltros({
                  ...filtros,
                  negocio: target.value,
                });
              }}
              sx={{ mb: 1 }}
              required
            >
              {negocios.length > 0 &&
                negocios.map((negocio: any, index) => (
                  <MenuItem key={index.toString()} value={negocio.id}>
                    {negocio.nombre}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Fecha inicio"
                onChange={(newvalue: any) => {                 
                  setFiltros({
                    ...filtros,
                    fecha_inicio: newvalue.format("YYYY-MM-DD"),
                  });
                }}
                format="YYYY-MM-DD"
                value={dayjs(filtros.fecha_inicio)}
                sx={{ mb: 1, mt: 1 }}
              />
            </LocalizationProvider>
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Fecha fin"
                onChange={(newvalue: any) => {
                  setFiltros({
                    ...filtros,
                    fecha_fin: newvalue.format("YYYY-MM-DD"),
                  });
                }}
                format="YYYY-MM-DD"
                value={dayjs(filtros.fecha_fin)}
                sx={{ mb: 1, mt: 1 }}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=> {
              obtenerVentasPeriodo(
                filtros.fecha_inicio,
                filtros.fecha_fin,
                filtros.negocio
              )
            }} autoFocus>
              BUSCAR
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

function PageVentaXPeriodo() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageVentaXPeriodo;
