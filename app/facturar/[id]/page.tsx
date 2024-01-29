"use client";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
  esES,
} from "@mui/x-data-grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface Factura {
  id: number;
  monto: number;
  pago_electronico: boolean;
  no_operacion: string | null;
  fecha: Date | Dayjs | null;
  nombre_punto: string;
  ventas: Array<Venta>;
}

interface Venta {
  producto: string;
  cantidad: number;
  precio: number;
  monto: number;
  punto: string;
  id: number;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const currencyFormatterCount = new Intl.NumberFormat("en-US");

const columns: GridColDef[] = [
  { field: "producto", headerName: "Producto", width: 140 },
  {
    field: "cantidad",
    headerName: "Cant",
    width: 120,
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatterCount.format(value);
    },
  },
  {
    field: "punto",
    headerName: "Punto",
    width: 80,
  },
  {
    field: "precio",
    headerName: "Precio",
    width: 120,
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: "monto",
    headerName: "Monto",
    width: 120,
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
];

function FormFactura() {
  const params = useParams();

  const router = useRouter();

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const [factura, setFactura] = useState<Factura>({
    id: 0,
    monto: 0,
    pago_electronico: false,
    no_operacion: null,
    fecha: new Date(),
    nombre_punto: "",
    ventas: [],
  });

  const [ventas, setVentas] = useState<Venta[]>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      punto: false,
    });

  useEffect(() => {
    if (params?.id) {
      const obtenerFactura = async (id: any) => {
        await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/factura/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setFactura(data);
            setVentas(JSON.parse(data.ventas));
          })
          .catch(function (error) {
            notificacion("Se ha producido un error");
          });
      };

      obtenerFactura(params?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h6" color="primary" align="center">
          DETALLES FACTURA
        </Typography>

        <TextField
          id="id"
          name="id"
          label="ID"
          value={factura.id}
          fullWidth
          sx={{ mb: 1 }}
          type="number"
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          id="nombre_punto"
          name="nombre_punto"
          label="Punto"
          value={factura.nombre_punto}
          fullWidth
          sx={{ mb: 1 }}
          type="text"
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          id="monto"
          name="monto"
          label="Monto"
          value={factura.monto}
          fullWidth
          sx={{ mb: 1 }}
          type="number"
          InputProps={{
            readOnly: true,
            startAdornment: "$",
          }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DateTimePicker
            label="Fecha"
            format="YYYY-MM-DD"
            sx={{ mb: 1 }}
            value={dayjs(factura.fecha)}
            readOnly={true}
          />
        </LocalizationProvider>
        <br />

        <FormControlLabel
          control={
            <Switch
              name="pago_electronico"
              checked={factura.pago_electronico}
            />
          }
          label="Pago electrónico"
          sx={{ mb: 1 }}
        />

        <TextField
          id="no_operacion"
          name="no_operacion"
          label="No. Operación"
          value={factura.no_operacion ?? ""}
          fullWidth
          sx={{ mb: 1, display: factura.pago_electronico ? "block" : "none" }}
          type="number"
          InputProps={{
            readOnly: true,
          }}
        />

        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={ventas}
          columns={columns}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibilityModel(newModel)
          }
          sx={{
            border: 0,
          }}
          rowHeight={40}
        />
      </Container>

      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="inherit"
          sx={{ mr: 1 }}
          onClick={() => router.push("/factura")}
          startIcon={<ArrowBackIcon />}
        >
          Regresar
        </Button>
      </Box>
    </>
  );
}

function FormNuevaFactura() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <FormFactura />
    </SnackbarProvider>
  );
}

export default FormNuevaFactura;
