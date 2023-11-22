"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Alert } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";

function ViewKiokoPropietario() {
  const router = useRouter();

  const { data: session, update } = useSession();

  const [kioskos, setKioskos] = useState([]);

  useEffect(() => {
    obtenerKioskosPropietario();
  }, []);

  const obtenerKioskosPropietario = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/kioskos/${session?.usuario}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setKioskos(data);
      });
  };

  return (
    <>
      {!kioskos.length ? (
        <Alert variant="outlined" severity="info">
          Usted no tiene Kioskos asociados. Contacte al administrador.
        </Alert>
      ) : (
        <>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {kioskos.map((kiosko, index) => (
              <ListItem key={index.toString()}>
                <ListItemAvatar>
                  <Avatar>
                    <StorefrontIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={kiosko.nombre}
                  secondary={kiosko.representante}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </>
  );
}

export default ViewKiokoPropietario;
