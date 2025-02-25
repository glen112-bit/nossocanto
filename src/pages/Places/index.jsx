
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Header from '../../components/Header'
import { useState, useEffect} from 'react';
import lugares from '../../assets/data.json';

export default function Places() {
    const [lugares, setLugares] = useState(null);

    useEffect(() => {
        let url = '/src/'
        fetch('../../assets/data.json')
      // headers : {
        // 'Content-Type': 'application/json',
        // 'Accept': 'application/json'
       // }
        .then(res => res.json())
        .then(res => setLugares(res))
    },[]);
  return (
    <div>
    <Header text="NossoCantoSp"/>
        <h1>Lugares Perto</h1>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel1-header"
        >
          <Typography component="span">Pontos turisticos
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
            {}
          <Typography>
              Galeria Metropole
          </Typography>
          <Typography>
              Biblioteca Mario de Andrade
          </Typography>
          <Typography>
              Rua Avanhandava
          </Typography>
          <Typography>
              Teatro Municipal
          </Typography>
          <Typography>
              Shopping Light
          </Typography>
          <Typography>
              Edificio Copan
          </Typography>
          <Typography>
              Terraco Italia
          </Typography>
          <Typography>
              Lanchonete Estadao
          </Typography>
          <Typography>
              Viaduto Sta. Efigenia
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">Bares e Balada</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Typography>
              Rooftop Matiz
          </Typography>
          <Typography>
              Rooftop no Edificio Ester/Olivier 
          </Typography>
          <Typography>
              Rooftop do Shopping Light
          </Typography>
          <Typography>
              Rooftop Matiz
          </Typography>
          <Typography>
              Parador: Restaurante com DayUse incluso no edificio Renata
          </Typography>
          <Typography>
              Tokio Karaoke
          </Typography>
          <Typography>
              Edificio
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
