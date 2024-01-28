import DenseAppBar from "../components/appMenuBar";
import { auth } from "auth"
import { redirect } from 'next/navigation'

export default async function Template({ children }: { children: React.ReactNode }) {
  
  const session = await auth();
  if(session?.rol != "dependiente"){
    redirect("/");
  }

  return (
    <>
      <DenseAppBar />
      {children}
    </>
  );
}