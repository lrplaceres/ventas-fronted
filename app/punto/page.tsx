"use client";
import { Button } from "@mui/material";
import { DataGrid, GridColDef, esES } from "@mui/x-data-grid";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const columns: GridColDef[] = [
  {
    field: "nombre",
    headerName: "Nombre",
    width: 150,
    renderCell: (params) => (
      <Link href={`/punto/${params.row.id}`} className="decoration-none">
        {params.row.nombre}
      </Link>
    ),
  },
  { field: "direccion", headerName: "Dirección", width: 150 },
  { field: "negocio_id", headerName: "Negocio", width: 150 },
];

function page() {
  const router = useRouter();

  const { data: session, update } = useSession();

  const [puntos, setPuntos] = useState([]);

  useEffect(() => {
    obtenerPuntos();
  }, []);

  const obtenerPuntos = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/puntos/${session.usuario}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session.token_type} ${session.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPuntos(data);
      });
  };

  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        sx={{ mt:1, mb: 1 }}
        startIcon={<AddBusinessIcon />}
        onClick={() => router.push("/punto/nuevo")}
      >
        Insertar Punto
      </Button>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={puntos}
          columns={columns}
        />
      </div>
    </>
  );
}

export default page;
