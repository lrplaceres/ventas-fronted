import PersonAddIcon from '@mui/icons-material/PersonAdd';
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
        startIcon={<PersonAddIcon />}
        onClick={() => router.push("/dependiente/nuevo")}
      >
        Insertar
      </Button>
    </div>
  );
}

export default BotonInsertar;