import type { Metadata } from "next";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./globals.css";
import { auth } from "auth";
import { Providers } from "./components/providers";

export const metadata: Metadata = {
  title: "SIMPLE_TPV",
  description: "Simple TPV POS",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session:any = await auth();
  return (
    <Providers session={session}>
      <html lang="es">
        <body>
          {children}
        </body>
      </html>
    </Providers>
  );
}
