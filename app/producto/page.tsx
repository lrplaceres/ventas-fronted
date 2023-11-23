"use client";
import { Button } from "@mui/material";
import { DataGrid, GridColDef, esES } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
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
      <Link href={`/producto/${params.row.id}`} className="decoration-none">
        {params.row.nombre}
      </Link>
    ),
  },
  { field: "negocio_id", headerName: "Negocio", width: 150 },
];

function page() {
  const router = useRouter();

  const { data: session, update } = useSession();

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/productos/${session.usuario}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session.token_type} ${session.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
      });
  };

  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        sx={{ mt: ".5rem", mb: ".5rem" }}
        startIcon={<PostAddIcon />}
        onClick={() => router.push("/producto/nuevo")}
      >
        Insertar Producto
      </Button>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={productos}
          columns={columns}
        />
      </div>
    </>
  );
}

export default page;
