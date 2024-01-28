"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { KeyboardEvent, MouseEvent, useState } from "react";
import {
  CssBaseline,
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
import SummarizeIcon from "@mui/icons-material/Summarize";
import { lightBlue } from "@mui/material/colors";
import HomeIcon from "@mui/icons-material/Home";
import SellIcon from '@mui/icons-material/Sell';

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
      <CssBaseline />
      <CssBaseline />
      <AppBar position="relative" sx={{ backgroundColor: lightBlue[900] }}>
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
            SIMPLE
          </Typography>
          {session && <OpcionesUsuario />}
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
            <ListItem disablePadding onClick={() => router.push("/")}>
              <ListItemButton>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={"Inicio"} />
              </ListItemButton>
            </ListItem>

            <Divider />

            {session?.rol == "propietario" && (
              <>
                <ListItem
                  disablePadding
                  onClick={() => router.push("/punto")}
                  sx={{
                    backgroundColor: pathname == "/punto" ? lightBlue[900] : "",
                    color: pathname == "/punto" ? "white" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <StorefrontIcon
                        sx={{
                          color: pathname == "/punto" ? "white" : "",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={"Puntos"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  onClick={() => router.push("/producto")}
                  sx={{
                    backgroundColor:
                      pathname == "/producto" ? lightBlue[900] : "",
                    color: pathname == "/producto" ? "white" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <MenuBookIcon
                        sx={{
                          color: pathname == "/producto" ? "white" : "",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={"Productos"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  onClick={() => router.push("/inventario")}
                  sx={{
                    backgroundColor:
                      pathname == "/inventario" ? lightBlue[900] : "",
                    color: pathname == "/inventario" ? "white" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <InventoryIcon
                        sx={{
                          color: pathname == "/inventario" ? "white" : "",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={"Inventario"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  onClick={() => router.push("/distribucion")}
                  sx={{
                    backgroundColor:
                      pathname == "/distribucion" ? lightBlue[900] : "",
                    color: pathname == "/distribucion" ? "white" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <LocalShippingIcon
                        sx={{
                          color: pathname == "/distribucion" ? "white" : "",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={"Distribución"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  onClick={() => router.push("/venta")}
                  sx={{
                    backgroundColor: pathname == "/venta" ? lightBlue[900] : "",
                    color: pathname == "/venta" ? "white" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <ShoppingCartIcon
                        sx={{
                          color: pathname == "/venta" ? "white" : "",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={"Ventas"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  onClick={() => router.push("/factura")}
                  sx={{
                    backgroundColor: pathname == "/factura" ? lightBlue[900] : "",
                    color: pathname == "/factura" ? "white" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <SellIcon
                        sx={{
                          color: pathname == "/factura" ? "white" : "",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={"Facturas"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  onClick={() => router.push("/dependiente")}
                  sx={{
                    backgroundColor:
                      pathname == "/dependiente" ? lightBlue[900] : "",
                    color: pathname == "/dependiente" ? "white" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <PeopleIcon
                        sx={{
                          color: pathname == "/dependiente" ? "white" : "",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={"Dependientes"} />
                  </ListItemButton>
                </ListItem>

                <Divider />

                <ListItem
                  disablePadding
                  onClick={() => router.push("/inventario/tarjetaalmacen")}
                  sx={{
                    backgroundColor:
                      pathname == "/inventario/tarjetaalmacen"
                        ? lightBlue[900]
                        : "",
                    color: pathname == "/inventario/tarjetaalmacen" ? "white" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <SummarizeIcon
                        sx={{
                          color:
                            pathname == "/inventario/tarjetaalmacen" ? "white" : "",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={"Tarjeta por producto"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  onClick={() => router.push("/inventario/existencia")}
                  sx={{
                    backgroundColor:
                      pathname == "/inventario/existencia"
                        ? lightBlue[900]
                        : "",
                    color: pathname == "/inventario/existencia" ? "white" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <SummarizeIcon
                        sx={{
                          color:
                            pathname == "/inventario/existencia" ? "white" : "",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={"Existencia almacén"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  onClick={() => router.push("/distribucion/existenciaxpunto")}
                  sx={{
                    backgroundColor:
                      pathname == "/distribucion/existenciaxpunto"
                        ? lightBlue[900]
                        : "",
                    color:
                      pathname == "/distribucion/existenciaxpunto"
                        ? "white"
                        : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <SummarizeIcon
                        sx={{
                          color:
                            pathname == "/distribucion/existenciaxpunto"
                              ? "white"
                              : "",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={"Existencia en punto"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  onClick={() => router.push("/venta/ventaxperiodo")}
                  sx={{
                    backgroundColor:
                      pathname == "/venta/ventaxperiodo" ? lightBlue[900] : "",
                    color: pathname == "/venta/ventaxperiodo" ? "white" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <SummarizeIcon
                        sx={{
                          color:
                            pathname == "/venta/ventaxperiodo" ? "white" : "",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={"Ventas por período"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  onClick={() => router.push("/venta/utilidadesxperiodo")}
                  sx={{
                    backgroundColor:
                      pathname == "/venta/utilidadesxperiodo"
                        ? lightBlue[900]
                        : "",
                    color:
                      pathname == "/venta/utilidadesxperiodo" ? "white" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <SummarizeIcon
                        sx={{
                          color:
                            pathname == "/venta/utilidadesxperiodo"
                              ? "white"
                              : "",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={"Utilidades por período"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  onClick={() => router.push("/venta/cuadre")}
                  sx={{
                    backgroundColor:
                      pathname == "/venta/cuadre" ? lightBlue[900] : "",
                    color: pathname == "/venta/cuadre" ? "white" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <SummarizeIcon
                        sx={{
                          color: pathname == "/venta/cuadre" ? "white" : "",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={"Cuadre"} />
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
                      pathname == "/negocio" ? lightBlue[900] : "",
                    color: pathname == "/negocio" ? "white" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <StorefrontIcon
                        sx={{
                          color: pathname == "/negocio" ? "white" : "",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={"Negocio"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  onClick={() => router.push("/usuario")}
                  sx={{
                    backgroundColor:
                      pathname == "/usuario" ? lightBlue[900] : "",
                    color: pathname == "/usuario" ? "white" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <PersonIcon
                        sx={{
                          color: pathname == "/usuario" ? "white" : "",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={"Usuario"} />
                  </ListItemButton>
                </ListItem>
              </>
            )}

            {session?.rol == "dependiente" && (
              <>
              <ListItem
                disablePadding
                onClick={() => router.push("/vender")}
                sx={{
                  backgroundColor: pathname == "/vender" ? lightBlue[900] : "",
                  color: pathname == "/vender" ? "white" : "",
                }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <PersonIcon
                      sx={{
                        color: pathname == "/vender" ? "white" : "",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={"Ventas"} />
                </ListItemButton>
              </ListItem>

              <ListItem
                  disablePadding
                  onClick={() => router.push("/facturar")}
                  sx={{
                    backgroundColor: pathname == "/facturar" ? lightBlue[900] : "",
                    color: pathname == "/facturar" ? "white" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <SellIcon
                        sx={{
                          color: pathname == "/facturar" ? "white" : "",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={"Facturas"} />
                  </ListItemButton>
                </ListItem>

              <ListItem
                disablePadding
                onClick={() => router.push("/vender/cuadre")}
                sx={{
                  backgroundColor: pathname == "/vender/cuadre" ? lightBlue[900] : "",
                  color: pathname == "/vender/cuadre" ? "white" : "",
                }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <SummarizeIcon
                      sx={{
                        color: pathname == "/vender/cuadre" ? "white" : "",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={"Cuadre"} />
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
