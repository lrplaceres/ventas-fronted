"use client";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import { Button, FormControlLabel } from "@mui/material";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function FormNuevoKiosko() {
  const router = useRouter();

  const label = { inputProps: { "aria-label": "Switch demo" } };

  const [kiosko, setKiosko] = useState({
    nombre: "",
    representante: "",
    activo: true,
    administrador: "",
  });

  const handleChange = ({ target: { name, value } }) => {
    setKiosko({ ...kiosko, [name]: value });
  };

  const handleChangeSlider = ({ target: { name, checked } }) => {
    setKiosko({ ...kiosko, [name]: checked });
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(kiosko);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>

        <Typography variant="h6" color="primary" align="center">
          INSERTAR KIOSKO
        </Typography>

        <TextField
          id="nombre"
          name="nombre"
          label="Nombre"
          value={kiosko.nombre}
          onChange={handleChange}
          fullWidth
          sx={{ mb: ".5rem" }}
        />

        <TextField
          id="representante"
          name="representante"
          label="Representante"
          value={kiosko.representante}
          onChange={handleChange}
          fullWidth
          sx={{ mb: ".5rem" }}
        />

        <FormControlLabel
          control={
            <Switch defaultChecked name="activo" onChange={handleChangeSlider} />
          }
          label="Activo"
          sx={{ mb: ".5rem" }}
        />

        <TextField
          id="administrador"
          name="administrador"
          label="Administrador"
          value={kiosko.administrador}
          onChange={handleChange}
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
        <Button variant="contained" color="success" type="submit">
          Aceptar
        </Button>
      </form>
    </>
  );
}

export default FormNuevoKiosko;
