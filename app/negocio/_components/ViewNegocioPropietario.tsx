"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Alert, Typography } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";

function ViewKiokoPropietario() {
  const router = useRouter();

  const { data: session, update } = useSession();

  const [negocios, setNegocios] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

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

  const notificacion = (mensaje: string, variant: VariantType = "error") => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, { variant });
  };

  

  return (
    <>
      {negocios.length == 0 ? (
        <Alert variant="outlined" severity="info">
          Usted no tiene Negocios asociados. Contacte al administrador.
        </Alert>
      ) : (
        <>
          <Typography variant="h5" color="primary" align="center">
            MIS NEGOCIOS
          </Typography>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {negocios.map((negocio:any, index) => (
              <ListItem key={index.toString()}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#1976d2" }}>
                    <StorefrontIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={negocio.nombre}
                  secondary={negocio.informacion}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </>
  );
}

function Pagepropietario() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <ViewKiokoPropietario />
    </SnackbarProvider>
  );
}

export default Pagepropietario;
