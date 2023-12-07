import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function Contacto() {
  return (
    <Box id="contacto" sx={{ minHeight: 200, width: "100%", mt: 4 }}>
      <Typography variant="h4" color="primary" textAlign="center">
        Información de contacto
      </Typography>

      <div>
        <Accordion disabled>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography>La Habana</Typography>
          </AccordionSummary>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel10a-content"
            id="panel10a-header"
          >
            <Typography>Ciego de Ávila</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lázaro Placeres <WhatsAppIcon /> <TelegramIcon />
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel11a-content"
            id="panel11a-header"
          >
            <Typography>Camagüey</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Aislyn Rodríguez <WhatsAppIcon /> <TelegramIcon />
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </Box>
  );
}

export default Contacto;
