"use client";
import DenseAppBar from "./components/appMenuBar";
import { useSession } from "next-auth/react";
import ViewKiokoPropietario from "./negocio/_components/ViewNegocioPropietario";
import GraficoVentas7Dias from "./venta/_components/GraficoVentas7Dias";
import GraficoInversion7Dias from "./inventario/_components/GraficoInversion7dias";
import Container from '@mui/material/Container'

export default function Home() {
  const { data: session, update } = useSession();

  return (
    <main>
      <DenseAppBar />
      <Container maxWidth="sm">        
      {session?.rol == "propietario" && (
        <>
          <ViewKiokoPropietario />
          <GraficoVentas7Dias />
          <GraficoInversion7Dias />
        </>
      )}
      </Container>

      {session?.rol == "superadmin" && (
        <>mostrar gráficas y estadísticas del uso de la app</>
      )}
    </main>
  );
}
