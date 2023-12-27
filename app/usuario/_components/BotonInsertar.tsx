import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

function BotonInsertar() {
  const router = useRouter();

  return (
    <div style={{ flexGrow: 1 }}>
      <Button
          variant="contained"
          color="inherit"
          sx={{ mt: 1, mb: 1 }}
          startIcon={<PersonAddAlt1Icon />}
          onClick={() => router.push("/usuario/nuevo")}
        >
          Insertar
        </Button>
    </div>
  );
}

export default BotonInsertar;