"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import "dayjs/locale/es";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import {
  DataGrid,
  esES,
  GridColDef,
  GridColumnGroupingModel,
} from "@mui/x-data-grid";
import VistasMenuDistribucion from "../_components/VistasMenuDistribucion";
import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { GridToolbarExport } from "@mui/x-data-grid";
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
  { field: "nombre_producto", headerName: "Producto", width: 160 },
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
  { field: "nombre_punto", headerName: "Punto", width: 120 },
  { field: "um", headerName: "UM", width: 120 },
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

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Existencia en punto",
    description: "",
    children: [{ field: "nombre_producto" }, { field: "existencia" }],
  },
];

interface Filtro {
  punto: number | string;
}

function Page() {
  const { data: session, update } = useSession();

  const [existencia, setExistencia] = useState([]);

  const [puntos, setPuntos] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const obtenerExistencia = async (punto: any) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/distribuciones-venta-resumen/${punto}`,
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
        setExistencia(data);
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

          <VistasMenuDistribucion />
        </div>

        <Box sx={{ height: "87vh", width: "100%" }}>
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={existencia}
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
            <FormControl fullWidth sx={{mt:1}}>
              <InputLabel>Punto</InputLabel>
              <Select
                id="punto"
                name="punto"
                label="Punto"
                onChange={(e)=>{
                  obtenerExistencia(e.target.value);
                }}
                sx={{ mb: 1 }}
                required
              >
                {puntos.length > 0 &&
                  puntos.map((punto: any, index) => (
                    <MenuItem key={index.toString()} value={punto.id}>
                      {punto.nombre}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
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

function Existencia() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default Existencia;
