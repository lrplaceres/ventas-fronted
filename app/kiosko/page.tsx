"use client"
import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const columns: GridColDef[] = [
  {
    field: "nombre",
    headerName: "nombre",
    width: 150,
    renderCell: (params) => (
      <Link href={`/kiosko/${params.row.id}`} className="decoration-none">
        {params.row.activo ? (
          params.row.nombre
        ) : (
          <del>{params.row.nombre}</del>
        )}
      </Link>
    ),
  },
  { field: "representante", headerName: "Representante", width: 150 },
];

function page() {
  const router = useRouter();

  const { data: session, update } = useSession();

  const [kioskos, setKioskos] = useState([]);

  useEffect(() => {
    obtenerKioskos();
  }, []);

  const obtenerKioskos = async () => {

    await fetch(`${process.env.MI_API_BACKEND}/kiosko`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${session.token_type} ${session.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setKioskos(data);
      });
  };

  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        sx={{ mt: ".5rem", mb: ".5rem" }}
        startIcon={<AddBusinessIcon />}
        onClick={() => router.push("/kiosko/nuevo")}
      >
        Insertar Kiosko
      </Button>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid rows={kioskos} columns={columns} />
      </div>
    </>
  );
}

export default page;
