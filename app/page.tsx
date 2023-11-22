"use client";
import DenseAppBar from "./components/appMenuBar";
import { useSession } from "next-auth/react";
import ViewKiokoPropietario from "./kiosko/_components/ViewKiokoPropietario";

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
