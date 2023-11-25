"use client";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import error404 from "@/public/error404.jpg";
import { Container } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from "next/navigation";

export default function RecipeReviewCard() {

  const router = useRouter();

  return (
    <>
      <Container maxWidth="sm" sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}>
        <Card variant="outlined" sx={{ maxWidth: 345 }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                $
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title="$1MPLE_TPV"
            subheader={new Date().toDateString()}
          />
          <CardMedia
            component="img"
            height="194"
            image={`${error404.src}`}
            alt="Houston"
          />
          <CardContent>
            <Typography variant="body2" >
              Por favor, conserve la calma. Si estás viendo esto es porque ha
              accedido a una página que no existe. Para regresar presione el ícono
              de la parte inferior. Si persiste el problema contacte al administrador y
              cuéntele lo sucedido.
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="Salir" onClick={() => router.push("/")}>
              <HomeIcon color="primary" />
            </IconButton>
          </CardActions>
        </Card>
      </Container>
    </>
  );
}
