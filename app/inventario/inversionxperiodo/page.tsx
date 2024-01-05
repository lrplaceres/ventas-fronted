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
import { Box, Button, Container } from "@mui/material";
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

const columns: GridColDef[] = [
  { field: "fecha", headerName: "Fecha", width: 140 },
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
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Listado de inversiones por período",
    description: "",
    children: [{ field: "fecha" }, { field: "monto" }],
  },
];

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    someCustomString: string;
    someCustomNumber: string;
  }
}


function CustomToolbar(props: NonNullable<GridSlotsComponentsProps['toolbar']>) {
  return (
    <GridToolbarContainer>
      {`${props.someCustomString} ${props.someCustomNumber}`}
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

  const [monto, setMonto] = useState<string>("0.00");

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
    obtenerInversionesPeriodo(fechas.fecha_inicio, fechas.fecha_fin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obtenerInversionesPeriodo = async (
    fecha_inicio: any,
    fecha_fin: any
  ) => {
    if (fecha_inicio > fecha_fin) {
      setInversiones([]);
      return notificacion("La fecha fin debe ser mayor que la fecha inicio");
    }
    await fetch(
      `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/inventarios-costos-brutos/${fecha_inicio}/${fecha_fin}`,
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

        let sum = 0;
        data.map((d: any) => {
          sum += d.monto;
        });
        setMonto(currencyFormatter.format(sum));
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
              <FilterAltIcon />
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
            slotProps={{
              toolbar: {
                // props required by CustomGridToolbar
                someCustomString: 'Inversión Total',
                someCustomNumber: monto,
              },
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
            {"Filtrar información"}
          </DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Fecha inicio"
                onChange={(newvalue: any) => {
                  obtenerInversionesPeriodo(
                    newvalue?.format("YYYY-MM-DD"),
                    fechas.fecha_fin
                  );
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
                  obtenerInversionesPeriodo(
                    fechas.fecha_inicio,
                    newvalue?.format("YYYY-MM-DD")
                  );
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
            <Button onClick={handleClose} autoFocus>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

function PageInversionPeriodo() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default PageInversionPeriodo;
