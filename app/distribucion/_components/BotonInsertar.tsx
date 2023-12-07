import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

function BotonInsertar() {
  const router = useRouter();

  return (
    <div style={{flexGrow: 1}}>
      <Button
        variant="contained"
        color="inherit"
        sx={{ mt: 1, mb: 1 }}
        startIcon={<LocalShippingIcon />}
        onClick={() => router.push("/distribucion/nuevo")}
      >
        Insertar distribución
      </Button>
    </div>
  );
}

export default BotonInsertar;