"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { KeyboardEvent, MouseEvent, useState } from "react";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InventoryIcon from "@mui/icons-material/Inventory";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import { useSession } from "next-auth/react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import OpcionesUsuario from "./OpcionesUsuario";

export default function DenseAppBar() {
  const { data: session, update } = useSession();

  const router = useRouter();

  const pathname = usePathname();

  type Anchor = "left";

  const [state, setState] = useState({
    left: false,
  });
 

  const toggleDrawer =
    (anchor: Anchor, open: boolean) => (event: KeyboardEvent | MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as KeyboardEvent).key === "Tab" ||
          (event as KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, ["left"]: open });
    };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            onClick={toggleDrawer("left", true)}
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            color="inherit"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            SIMPLE_TPV
          </Typography>
          {session && (
            <OpcionesUsuario />
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor={"left"}
        open={state["left"]}
        onClose={toggleDrawer("left", false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer("left", false)}
          onKeyDown={toggleDrawer("left", false)}
        >
          <List>
            {session?.rol == "propietario" && (
              <>
                <ListItem
                  disablePadding
                  onClick={() => router.push("/punto")}
                  sx={{
                    backgroundColor:
                      pathname?.split("/")[1] == "punto" ? "#bbdefb" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <StorefrontIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Puntos"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  onClick={() => router.push("/producto")}
                  sx={{
                    backgroundColor:
                      pathname?.split("/")[1] == "producto" ? "#bbdefb" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <MenuBookIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Productos"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  onClick={() => router.push("/inventario")}
                  sx={{
                    backgroundColor:
                      pathname?.split("/")[1] == "inventario" ? "#bbdefb" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <InventoryIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Inventario"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  onClick={() => router.push("/distribucion")}
                  sx={{
                    backgroundColor:
                      pathname?.split("/")[1] == "distribucion"
                        ? "#bbdefb"
                        : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <LocalShippingIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Distribución"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  onClick={() => router.push("/venta")}
                  sx={{
                    backgroundColor:
                      pathname?.split("/")[1] == "venta" ? "#bbdefb" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <ShoppingCartIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Venta"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  onClick={() => router.push("/error/construccion")}
                  sx={{
                    backgroundColor:
                      pathname?.split("/")[1] == "dependiente" ? "#bbdefb" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Dependientes"} />
                  </ListItemButton>
                </ListItem>
              </>
            )}

            {session?.rol == "superadmin" && (
              <>
                <ListItem
                  disablePadding
                  onClick={() => router.push("/negocio")}
                  sx={{
                    backgroundColor:
                      pathname?.split("/")[1] == "negocio" ? "#bbdefb" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <StorefrontIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Negocio"} />
                  </ListItemButton>
                </ListItem>

                <Divider />

                <ListItem
                  disablePadding
                  onClick={() => router.push("/usuario")}
                  sx={{
                    backgroundColor:
                      pathname?.split("/")[1] == "usuario" ? "#bbdefb" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Usuario"} />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
