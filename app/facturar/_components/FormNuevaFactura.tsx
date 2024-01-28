import React, { FormEvent, useCallback, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Divider,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { useSession } from "next-auth/react";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  esES,
} from "@mui/x-data-grid";
import { GridRowModel } from "@mui/x-data-grid";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import "dayjs/locale/es";
import dayjs, { Dayjs } from "dayjs";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface Producto {
  id: number;
  distribucion_id: string;
  cantidad: number;
  precio: number;
  punto_id: number;
  nombre_producto: string;
  nombre_punto: string;
}

interface Pago {
  pago_electronico: boolean;
  no_operacion: string | null;
  fecha: Date | Dayjs | null;
  punto_id: number;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const currencyFormatterCount = new Intl.NumberFormat("en-US");

function FormFactura() {
  const columns: GridColDef[] = [
    {
      field: "nombre_producto",
      headerName: "Nombre",
      type: "string",
      width: 140,
    },
    {
      field: "cantidad",
      headerName: "Cant",
      width: 80,
      type: "number",
      editable: true,
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
      width: 100,
      type: "number",
      valueFormatter: ({ value }) => {
        if (!value) {
          return value;
        }
        return currencyFormatter.format(value);
      },
      valueGetter: ({ row }) => {
        return row.cantidad * row.precio;
      },
    },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          key={`a${params.row.id}`}
          icon={<DeleteIcon color="error" />}
          label="Eliminar"
          onClick={() => {
            handleClickOpen();
            setTemp(params.id);
          }}
        />,
      ],
    },
  ];

  const useFakeMutation = () => {
    return useCallback(
      (carritoGrid: Partial<Producto>) =>
        new Promise<Partial<Producto>>((resolve, reject) => {
          setTimeout(() => {
            if (!carritoGrid.cantidad || carritoGrid.cantidad <= 0) {
              reject(new Error("Error while saving car: cant can't be empty."));
            } else {
              resolve({ ...carritoGrid, cantidad: carritoGrid.cantidad });
            }
          }, 200);
        }),
      []
    );
  };

  const mutateRow = useFakeMutation();

  const router = useRouter();

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const [distribuciones, setDistribuciones] = useState<any>([]);

  const [maximacantidad, setMaximaCantidad] = useState(0);

  const [um, setUm] = useState("");

  const [producto, setProducto] = useState<Producto>({
    id: Math.floor(Math.random() * 1001),
    distribucion_id: "",
    cantidad: 0,
    precio: 0,
    punto_id: 0,
    nombre_producto: "",
    nombre_punto: "",
  });

  const [detallesPago, setDetallesPago] = useState<Pago>({
    pago_electronico: false,
    no_operacion: "",
    fecha: new Date(),
    punto_id: 0,
  });

  const [totalPedido, setTotalPedido] = useState(0);

  const [carrito, setCarrito] = useState<Producto[]>([]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [temp, setTemp] = useState<any>(0);

  useEffect(() => {
    const obtenerDistribuciones = async () => {
      await fetch(
        `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/distribuciones-venta-punto`,
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
          setDistribuciones(data);
        })
        .catch(function (error) {
          notificacion("Se ha producido un error");
        });
    };

    obtenerDistribuciones();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = ({ target: { name, value } }: any) => {
    setProducto({ ...producto, [name]: value });
  };

  const handleChangeDetallesPago = ({ target: { name, value } }: any) => {
    setDetallesPago({ ...detallesPago, [name]: value });
  };

  const handleChangeSlider = ({ target: { name, checked } }: any) => {
    setDetallesPago({ ...detallesPago, [name]: checked });
  };

  const handleProcessRowUpdateError = (error: Error) => {
    console.log(error);
  };

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const handleAddCar = async (e: FormEvent) => {
    e.preventDefault();
    if (producto.cantidad <= 0) {
      return notificacion("La cantidad debe ser mayor que cero");
    }

    if (
      !carrito.find(
        ({ distribucion_id }) => distribucion_id === producto.distribucion_id
      )
    ) {
      setCarrito([...carrito, producto]);
      setTotalPedido(totalPedido + producto.cantidad * producto.precio);
      setDetallesPago({...detallesPago, punto_id: producto.punto_id});
    }
    setProducto({
      id: Math.floor(Math.random() * 1001),
      distribucion_id: "",
      cantidad: 0,
      precio: 0,
      punto_id: 0,
      nombre_producto: "",
      nombre_punto: "",
    });

    setMaximaCantidad(0);
    setUm("");
  };

  const calcularMontoTotal = () => {
    let totalParcial = 0;
    carrito.map(({ cantidad, precio }) => {
      totalParcial += cantidad * precio;
    });
    setTotalPedido(totalParcial);
  };

  const processRowUpdate = React.useCallback(
    async (newRow: GridRowModel) => {
      const response = await mutateRow(newRow);

      var index = carrito.findIndex(
        ({ distribucion_id }) => distribucion_id === newRow.distribucion_id
      );
      var array2: Producto[] = [];
      var copyOfCarrito: Producto[] = array2.concat(carrito);
      copyOfCarrito[index].cantidad = newRow.cantidad;
      setCarrito(copyOfCarrito);

      calcularMontoTotal();
      return response;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [carrito]
  );

  const eliminardeCarrito = (id: number) => {
    const carritoCopy = carrito.filter((car: Producto) => car.id != id);
    setCarrito(carritoCopy);
    handleClose();

    let totalParcial = 0;
    carritoCopy.map(({ cantidad, precio }) => {
      totalParcial += cantidad * precio;
    });
    setTotalPedido(totalParcial);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    try {
      if (!detallesPago.punto_id) {
        return notificacion("Debe seleccionar un punto");
      }

      fetch(
        `${process.env.NEXT_PUBLIC_MI_API_BACKEND}/factura/?totalPedido=${totalPedido}`,
        {
          method: "POST",
          body: JSON.stringify({ carrito, detallesPago }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      ).then(function (response) {
        if (response.ok) {
          response.json().then((data) => {
            notificacion(`Se ha insertado la factura`, "info");
            setTimeout(() => router.push("/facturar"), 300);
          });
        } else {
          response.json().then((data) => {
            notificacion(`${data.detail}`);
          });
        }
      });
    } catch (error: any) {
      return notificacion(error);
    }
  };

  return (
    <>
      <Container maxWidth="lg">
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <Typography variant="h6" color="primary" align="center">
                INSERTAR PRODUCTO
              </Typography>

              <form onSubmit={handleAddCar}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={distribuciones}
                  getOptionLabel={(option: any) =>
                    `${option.nombre_producto} ► ${option.nombre_punto} ► \ud83d\udcc5${option.fecha}`
                  }
                  sx={{ mb: 1 }}
                  onChange={(event: any, newValue: any | null) => {
                    if (!!newValue) {
                      setProducto({
                        ...producto,
                        id: newValue.id,
                        distribucion_id: newValue.id,
                        punto_id: newValue.punto_id,
                        precio: newValue.precio_venta,
                        nombre_producto: newValue.nombre_producto,
                        nombre_punto: newValue.nombre_punto,
                      });
                      setMaximaCantidad(
                        newValue.cantidad - newValue.cantidad_vendida
                      );
                      setUm(newValue.um);
                    } else {
                      setProducto({
                        ...producto,
                        distribucion_id: "",
                        punto_id: 0,
                        precio: 0,
                        cantidad: 0,
                        nombre_producto: "",
                        nombre_punto: "",
                        id: Math.floor(Math.random() * 1001),
                      });
                      setMaximaCantidad(0);
                      setUm("");
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Producto" required />
                  )}
                  disabled={distribuciones.length > 0 ? false : true}
                />

                <TextField
                  id="cantidad"
                  name="cantidad"
                  label="Cantidad"
                  value={producto.cantidad}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 1 }}
                  type="number"
                  required
                  inputProps={{
                    max: maximacantidad,
                  }}
                  helperText={`Cantidad disponible: ${maximacantidad} UM: ${um}`}
                  disabled={producto.distribucion_id ? false : true}
                />

                <TextField
                  id="precio"
                  name="precio"
                  label="Precio"
                  value={producto.precio}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 1 }}
                  type="number"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {currencyFormatter.format(
                          producto.cantidad * producto.precio
                        )}
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ mr: 1 }}
                    startIcon={<AddShoppingCartIcon />}
                  >
                    Añadir
                  </Button>
                </Box>
              </form>
            </Grid>

            <Grid item xs={12} sm={7}>
              <Typography variant="h6" color="primary" align="center">
                CARRITO
              </Typography>

              <Box>
                <DataGrid
                  autoHeight
                  localeText={
                    esES.components.MuiDataGrid.defaultProps.localeText
                  }
                  rows={carrito}
                  columns={columns}
                  sx={{
                    border: 0,
                  }}
                  rowHeight={40}
                  processRowUpdate={processRowUpdate}
                  onProcessRowUpdateError={handleProcessRowUpdateError}
                />

                <Divider />

                <Grid container spacing={0} sx={{ height: 40 }}>
                  <Grid item xs={9} sm={9}>
                    Total
                  </Grid>
                  <Grid item xs={3} sm={3}>
                    <b>{currencyFormatter.format(totalPedido)}</b>
                  </Grid>
                </Grid>
              </Box>

              <form onSubmit={handleSubmit}>
                
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="es"
                >
                  <DateTimePicker
                    label="Fecha"
                    onChange={(newvalue) => {
                      setDetallesPago({
                        ...detallesPago,
                        fecha: newvalue,
                      });
                    }}
                    format="YYYY-MM-DD"
                    sx={{ mb: 1 }}
                    value={dayjs(detallesPago.fecha)}
                  />
                </LocalizationProvider>

                <br />

                <FormControlLabel
                  control={
                    <Switch
                      name="pago_electronico"
                      onChange={handleChangeSlider}
                      checked={detallesPago.pago_electronico}
                    />
                  }
                  label="Pago electrónico"
                  sx={{ mb: 1 }}
                />

                <TextField
                  id="no_operacion"
                  name="no_operacion"
                  label="No. operación"
                  value={detallesPago.no_operacion}
                  onChange={handleChangeDetallesPago}
                  fullWidth
                  sx={{
                    mb: 1,
                    display: detallesPago.pago_electronico ? "block" : "none",
                  }}
                />

                <Box sx={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="inherit"
                    sx={{ mr: 1 }}
                    onClick={() => router.push("/factura")}
                    startIcon={<CancelIcon />}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ mr: 1 }}
                    startIcon={<DoneIcon />}
                    disabled={carrito.length > 0 ? false : true}
                  >
                    Aceptar
                  </Button>
                </Box>
              </form>
            </Grid>
          </Grid>
        </Box>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Eliminar Carrito"}
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
              onClick={() => eliminardeCarrito(temp)}
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
