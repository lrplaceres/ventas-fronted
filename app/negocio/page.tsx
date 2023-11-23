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
      <Link href={`/negocio/${params.row.id}`} className="decoration-none">
        {params.row.activo ? params.row.nombre : <del>{params.row.nombre}</del>}
      </Link>
    ),
  },
  { field: "direccion", headerName: "Dirección", width: 150 },
  { field: "informacion", headerName: "Información", width: 150 },
];

function page() {
  const router = useRouter();

  const { data: session, update } = useSession();

  const [negocios, setNegocios] = useState([]);

  useEffect(() => {
    obtenerNegocios();
  }, []);

  const obtenerNegocios = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/negocio`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session.token_type} ${session.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNegocios(data);
      });
  };

  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        sx={{ mt: ".5rem", mb: ".5rem" }}
        startIcon={<AddBusinessIcon />}
        onClick={() => router.push("/negocio/nuevo")}
      >
        Insertar Negocio
      </Button>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={negocios}
          columns={columns}
        />
      </div>
    </>
  );
}

export default page;
