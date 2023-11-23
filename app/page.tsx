"use client";
import DenseAppBar from "./components/appMenuBar";
import { useSession } from "next-auth/react";
import ViewKiokoPropietario from "./negocio/_components/ViewNegocioPropietario";

export default function Home() {
  const { data: session, update } = useSession();

  return (
    <main>
      <DenseAppBar />
      <p>Welcome {session?.user.name}!</p>
      {session?.rol == "propietario" && (
        <>
          <ViewKiokoPropietario />
        </>
      )}
    </main>
  );
}
