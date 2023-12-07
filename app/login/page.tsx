"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import LoginIcon from "@mui/icons-material/Login";
import Producto from "./_components/Producto";
import Precio from "./_components/Precio";
import Contacto from "./_components/Contacto";
import Vistas from "./_components/Vistas";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 200;

export default function DrawerAppBar(props: Props) {
  const router = useRouter();

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        SIMPLE_TPV
      </Typography>
      <Divider />
      <List>
        
          <ListItem disablePadding onClick={() => router.push("/login#producto")}>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary="Producto" />
            </ListItemButton>
          </ListItem>
        
          <ListItem disablePadding onClick={() => router.push("/login#precio")}>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary="Precios" />
            </ListItemButton>
          </ListItem>


          <ListItem disablePadding onClick={() => router.push("/login#contacto")}>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary="Contacto" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding onClick={() => router.push("/login/form")}>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1}}
          >
            SIMPLE_TPV
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Button
              sx={{ color: "#fff" }}
              onClick={() => router.push("/login#producto")}
            >
              Producto
            </Button>

            <Button
              sx={{ color: "#fff" }}
              onClick={() => router.push("/login#precio")}
            >
              Precios
            </Button>

            <Button
              sx={{ color: "#fff" }}
              onClick={() => router.push("/login#contacto")}
            >
              Contacto
            </Button>

            <Button
              sx={{ color: "#fff" }}
              onClick={() => router.push("/login/form")}
            >
              <LoginIcon />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box sx={{ p: 3 }}>
        <Toolbar />
        <Producto />

        <Vistas />

        <Precio />

        <Contacto />

        <Typography
          variant="button"
          color="initial"
          textAlign="center"
          component="div"
        >
          ©2023, Ciego de Ávila, Cuba
        </Typography>
      </Box>
    </Box>
  );
}
