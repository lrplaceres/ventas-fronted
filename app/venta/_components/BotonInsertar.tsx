import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

function BotonInsertar() {
  const router = useRouter();

  return (
    <div style={{flexGrow: 1}}>
      <Button
        variant="contained"
        color="inherit"
        sx={{ mt: 1, mb: 1, flexGrow: 1}}
        startIcon={<AddShoppingCartIcon />}
        onClick={() => router.push("/venta/nueva")}
      >
        Insertar Venta
      </Button>
    </div>
  );
}

export default BotonInsertar;
