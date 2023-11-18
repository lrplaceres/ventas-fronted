import FormEditarUsuario from "../_components/FormEditarUsuario"

function page({ params }: { params: { id: string }}) {
  return (
    <FormEditarUsuario />
  )
}

export default page