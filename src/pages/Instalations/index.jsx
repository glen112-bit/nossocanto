
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import myData from '../../assets/myData.json';
import Stack from '@mui/material/Stack';
import { Item } from '../../components/Item'
import './style.css'

export default function Instalations() {
    let Instalacoes = myData.instalations
  return (
    <div>
       <h1>Instalacoes</h1>
      <Accordion>
       <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel4-content"
          id="panel1-header"
        >
          <Typography><Item>Instalacoes</Item></Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Stack spacing={2}>
                {Instalacoes.map(instal => <Typography><Item>{instal}</Item></Typography>)}
            </Stack>    
        </AccordionDetails>
      </Accordion>
          </div>
  );
}
