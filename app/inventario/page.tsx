"use client";
import { Button } from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { useRouter } from "next/navigation";

const rows: GridRowsProp = [
  { id: 1, col1: "Hello", col2: "World" },
  { id: 2, col1: "DataGridPro", col2: "is Awesome" },
  { id: 3, col1: "MUI", col2: "is Amazing" },
];

const columns: GridColDef[] = [
  { field: "col1", headerName: "Column 1", width: 150 },
  { field: "col2", headerName: "Column 2", width: 150 },
];

function page() {

  const router = useRouter();

  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        sx={{ mt: ".5rem", mb: ".5rem" }}
        startIcon={<LibraryAddIcon />}
        onClick={()=>router.push("/inventario/nuevo")}
      >
        Insertar Inventario
      </Button>

      <div style={{ height: 300, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </>
  );
}

export default page;
