import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

function BotonInsertar() {
  const router = useRouter();

  return (
    <div style={{ flexGrow: 1 }}>
      <Button
          variant="contained"
          color="inherit"
          sx={{ mt: 1, mb: 1 }}
          startIcon={<AddBusinessIcon />}
          onClick={() => router.push("/negocio/nuevo")}
        >
          Insertar
        </Button>
    </div>
  );
}

export default BotonInsertar;
