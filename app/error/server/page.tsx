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
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import houstontenemosunproblema from "@/public/houstontenemosunproblema.png";
import { Container } from "@mui/material";
import { signOut } from "next-auth/react";

export default function RecipeReviewCard() {
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
            title="SIMPLE_TPV"
            subheader={new Date().toDateString()}
          />
          <CardMedia
            component="img"
            height="194"
            image={`${houstontenemosunproblema.src}`}
            alt="Houston"
          />
          <CardContent>
            <Typography variant="body2" >
              Por favor, conserve la calma. Si estás viendo esto es porque ha
              ocurrido algún error. Sólo contacte al administrador y
              cuéntele lo sucedido.
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="Salir" onClick={() => signOut()}>
              <ExitToAppIcon color="primary" />
            </IconButton>
          </CardActions>
        </Card>
      </Container>
    </>
  );
}
