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
  GridColumnVisibilityModel,
  GridSlotsComponentsProps,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Box, Button, Container } from "@mui/material";
import { GridToolbarExport } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

interface Filtro {
  punto: number | string;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const currencyFormatterCount = new Intl.NumberFormat("en-US");

declare module "@mui/x-data-grid" {
  interface FooterPropsOverrides {
    montoTotal: number;
  }
}

export function CustomFooterStatusComponent(
  props: NonNullable<GridSlotsComponentsProps["footer"]>
) {
  return (
    <Box sx={{ p: 1, display: "flex" }}>
      Monto Total{" "}
      {props.montoTotal?.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })}
    </Box>
  );
}

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
    },
    {
      field: "existencia",
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
      field: "precio_venta",
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
    {
      field: "cantidad_vendida",
      headerName: "Cant V.",
      width: 120,
      type: "number",
      valueFormatter: ({ value }) => {
        if (!value) {
          return value;
        }
        return currencyFormatterCount.format(value);
      },
    },
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
    { field: "um", type: "string", headerName: "UM", width: 120 },
  ];

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "Cuadre del punto",
      description: "",
      children: [{ field: "nombre_producto" }, { field: "existencia" }],
    },
  ];

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      nombre_punto: false,
      um: false,
    });

  const { data: session, update } = useSession();

  const [filtro, setFiltro] = useState<Filtro>({
    punto: "",
  });

  const [cuadre, setCuadre] = useState([]);

  const [montoTotal, setMontoTotal] = useState<number>(0);

  const { enqueueSnackbar } = useSnackbar();

  const [fechas, setFechas] = useState({
    fecha_inicio: dayjs(new Date()).format("YYYY-MM-DD"),
    fecha_fin: dayjs(new Date()).format("YYYY-MM-DD"),
  });

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    obtenerCuadre();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const obtenerCuadre = async () => {
    handleClose();

    await fetch(
      `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/distribuciones-venta-cuadre-dependiente/${fechas.fecha_inicio}/${fechas.fecha_fin}/${filtro.punto}`,
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
        setCuadre(data);

        let sum = 0;
        data.map((d: any) => {
          sum += d.monto;
        });
        setMontoTotal(sum);
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
        </div>

        <Box sx={{ height: "88vh", width: "100%" }}>
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={cuadre}
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
            slots={{
              footer: CustomFooterStatusComponent,
              toolbar: CustomToolbar,
            }}
            slotProps={{
              footer: { montoTotal },
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
                  setFechas({
                    ...fechas,
                    fecha_inicio: newvalue.format("YYYY-MM-DD"),
                  });
                }}
                format="YYYY-MM-DD"
                defaultValue={dayjs(fechas.fecha_inicio)}
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
            <Button onClick={obtenerCuadre} autoFocus>
              Buscar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

function Cuadre() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default Cuadre;
