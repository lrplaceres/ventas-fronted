"use client";
import { Container } from "@mui/material";
import FormNuevaFactura from "../_components/FormNuevaFactura";

function page() {
  return (
    <>
      <Container maxWidth="lg">
        <FormNuevaFactura />
      </Container>
    </>
  );
}

export default page;
