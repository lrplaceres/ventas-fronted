"use client";
import { Button } from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const columns: GridColDef[] = [
  { field: "usuario", headerName: "Usuario", width: 150,
  renderCell: (params) => (
    <Link href={`/user/${params.row.id}`} className="decoration-none">
      {params.row.activo ? (
        params.row.usuario
      ) : (
        <del>{params.row.usuario}</del>
      )}
    </Link>
  ), },
  { field: "rol", headerName: "Rol", width: 150 },
];

function page() {
  const router = useRouter();

  const [usuarios, setUsuarios] = useState([]);


  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    await fetch(`${process.env.MI_API_BACKEND}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsuarios(data);
      });
  };

  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        sx={{ mt: ".5rem", mb: ".5rem" }}
        startIcon={<PersonAddAlt1Icon />}
        onClick={() => router.push("/user/nuevo")}
      >
        Insertar Usuario
      </Button>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid rows={usuarios} columns={columns} />
      </div>
    </>
  );
}

export default page;
