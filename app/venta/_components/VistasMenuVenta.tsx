import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";

export default function VistasMenuVenta() {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="Regresar a la página anterior"
        onClick={() => router.back()}
        title="Regresar a la página anterior"
      >
        <ArrowBackIcon color="primary" />
      </IconButton>

      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ float: "right" }}
      >
        <MenuIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => router.push("/venta/cuadre")}>
          Cuadre
        </MenuItem>       
        <MenuItem onClick={() => router.push("/venta/ventaxperiodo")}>
          Ventas por período
        </MenuItem>
        <MenuItem onClick={() => router.push("/venta/ventasbrutasxperiodo")}>
          Ventas brutas por período
        </MenuItem>
        <MenuItem onClick={() => router.push("/venta/utilidadesxperiodo")}>
          Utilidades por período
        </MenuItem>
      </Menu>
    </>
  );
}
