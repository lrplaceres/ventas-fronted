"use client"
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import { Button, FormControlLabel } from "@mui/material";
import { useRouter } from "next/navigation";

function FormNuevoKiosko() {
  const router = useRouter();

  const label = { inputProps: { "aria-label": "Switch demo" } };

  const top100Films = [
    { label: "The Shawshank Redemption", year: 1994 },
    { label: "The Godfather", year: 1972 },
    { label: "The Godfather: Part II", year: 1974 },
    { label: "The Dark Knight", year: 2008 },
    { label: "12 Angry Men", year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: "Pulp Fiction", year: 1994 },
  ];

  return (
    <>
      <form>
        <Typography variant="h6" color="primary" align="center">
          INSERTAR KIOSKO
        </Typography>
        <TextField
          id="nombre"
          label="Nombre"
          //value={}
          //onChange={}
          fullWidth
          sx={{ mb: ".5rem" }}
        />

        <TextField
          id="representante"
          label="Representante"
          //value={}
          //onChange={}
          fullWidth
          sx={{ mb: ".5rem" }}
        />

        <FormControlLabel control={<Switch defaultChecked />} label="Activo" sx={{mb:".5rem"}}/>

        <TextField
          id="administrador"
          label="Administrador"
          //value={}
          //onChange={}
          fullWidth
          sx={{ mb: ".5rem" }}
        />

        <Button
          variant="contained"
          color="error"
          sx={{ mr: ".5rem" }}
          onClick={() => router.push("/kiosko")}
        >
          Cancelar
        </Button>
        <Button variant="contained" color="success">
          Aceptar
        </Button>
      </form>
    </>
  );
}

export default FormNuevoKiosko;
