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
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import { AccountCircle } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function DenseAppBar() {
  const { data: session, update } = useSession();

  const router = useRouter();

  const pathname = usePathname();

  type Anchor = "left";

  const [state, setState] = useState({
    left: false,
  });

  const [auth, setAuth] = useState(true);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
            $1MPLE_TPV
          </Typography>
          {session && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{ width: 300 }}
              >
                <MenuItem onClick={() => router.push("/perfil")}>
                  <PersonIcon />
                  <Typography textAlign="center">Perfil</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => signOut()}>
                  <ExitToAppIcon />
                  <Typography textAlign="center">Salir</Typography>
                </MenuItem>
              </Menu>
            </div>
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
                  onClick={() => router.push("/producto")}
                  sx={{
                    backgroundColor:
                      pathname.split("/")[1] == "producto" ? "#bbdefb" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <MenuBookIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Producto"} />
                  </ListItemButton>
                </ListItem>

                <Divider />
                <ListItem
                  disablePadding
                  onClick={() => router.push("/inventario")}
                  sx={{
                    backgroundColor:
                      pathname.split("/")[1] == "inventario" ? "#bbdefb" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <InventoryIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Inventario"} />
                  </ListItemButton>
                </ListItem>

                <Divider />

                <ListItem
                  disablePadding
                  onClick={() => router.push("/venta")}
                  sx={{
                    backgroundColor:
                      pathname.split("/")[1] == "venta" ? "#bbdefb" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <AttachMoneyIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Venta"} />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </>
            )}

            {session?.rol == "superadmin" && (
              <>
                <ListItem
                  disablePadding
                  onClick={() => router.push("/kiosko")}
                  sx={{
                    backgroundColor:
                      pathname?.split("/")[1] == "kiosko" ? "#bbdefb" : "",
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <StorefrontIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Kiosko"} />
                  </ListItemButton>
                </ListItem>
                <Divider />

                <ListItem
                  disablePadding
                  onClick={() => router.push("/usuario")}
                  sx={{
                    backgroundColor:
                      pathname.split("/")[1] == "usuario" ? "#bbdefb" : "",
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
