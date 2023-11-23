"use client";
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { Button } from "@mui/material";
import { DataGrid, GridColDef, esES } from "@mui/x-data-grid";
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
      <Link href={`/inventario/${params.row.id}`} className="decoration-none">
        {params.row.nombre}
      </Link>
    ),
  },
  { field: "cantidad", headerName: "Cantidad", width: 150 },
  { field: "negocio_id", headerName: "Negocio", width: 150 },
];

function page() {
  const router = useRouter();

  const { data: session, update } = useSession();

  const [inventarios, setInventarios] = useState([]);

  useEffect(() => {
    obtenerInventarios();
  }, []);

  const obtenerInventarios = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/inventarios/${session?.usuario}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session?.token_type} ${session?.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setInventarios(data);
      });
  };

  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        sx={{ mt:  1 , mb:  1  }}
        startIcon={<LibraryAddIcon />}
        onClick={() => router.push("/inventario/nuevo")}
      >
        Insertar Inventario
      </Button>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={inventarios}
          columns={columns}
        />
      </div>
    </>
  );
}

export default page;
