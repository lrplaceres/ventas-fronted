"use client";
import {
  GridActionsCellItem,
  GridColDef,
  GridColumnGroupingModel,
  GridColumnVisibilityModel,
  GridToolbarContainer,
  GridToolbarExport,
  esES,
} from "@mui/x-data-grid";
import BotonInsertar from "./_components/BotonInsertar";
import Container from "@mui/material/Container";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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
      field: "id",
      headerName: "ID",
      width: 80,
      type: "string",
      renderCell: (params) => {
        if (params.row.pago_electronico) {
          return (
            <>
              <Link
                href={`/factura/${params.row.id}`}
                className="decoration-none"
              >
                {params.value}
              </Link>
            </>
          );
        } else {
          return (
            <Link
              href={`/factura/${params.row.id}`}
              className="decoration-none"
            >
              {params.value}
            </Link>
          );
        }
      },
    },
    {
      field: "nombre_punto",
      headerName: "Punto",
      width: 120,
      type: "string",
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
    {
      field: "pago_electronico",
      type: "boolean",
      headerName: "Pago electrónico",
      width: 120,
    },
    {
      field: "no_operacion",
      type: "string",
      headerName: "No. Operación",
      width: 120,
    },
    {
      field: "fecha",
      type: "dateTime",
      headerName: "Fecha",
      width: 180,
      valueGetter: ({ value }) => value && new Date(value),
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
          showInMenu
        />,
      ],
    },
  ];

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "Listado de facturas",
      description: "",
      children: [{ field: "id" }, { field: "nombre_punto" }],
    },
  ];

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      pago_electronico: false,
      no_operacion: false,
    });

  const { data: session, update } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const [facturas, setFacturas] = useState([]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [temp, setTemp] = useState<any>(0);

  useEffect(() => {
    const obtenerNegocios = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/facturas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setFacturas(data);
        })
        .catch(function (error) {
          notificacion("Se ha producido un error");
        });
    };

    obtenerNegocios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  const eliminarFactura = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_MI_API_BACKEND}/factura/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then(function (response) {
        if (response.ok) {
          notificacion(`El Inventario ha sido eliminado`, "info");
          setFacturas(facturas.filter((factura: any) => factura.id != id));
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
      <Container maxWidth="lg">
        <BotonInsertar />

        <Box sx={{ height: "88vh", width: "100%" }}>
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={facturas}
            columns={columns}
            checkboxSelection
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={columnGroupingModel}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
              setColumnVisibilityModel(newModel)
            }
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
            {"Eliminar factura"}
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
              onClick={() => eliminarFactura(temp)}
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

function Facturas() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Page />
    </SnackbarProvider>
  );
}

export default Facturas;
