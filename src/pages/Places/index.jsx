
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import data from '../../assets/data.json';
import Stack from '@mui/material/Stack';
import { Item } from '../../components/Item'
import './style.css'

export default function Places() {
let Lugares = data.places
let Bares = data.bares
  return (
    <div>
        <h1>Lugares Perto</h1>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel4-content"
          id="panel1-header"
        >
         <Typography>
            <Item>
                Pontos Turisticos
            </Item>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Stack spacing={2}>
                {Lugares.map((lugar) => <Typography><Item>{lugar}</Item></Typography>)}
            </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>
              <Item>
                  Bares e Balada
              </Item>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Stack spacing={2}>
                {Bares.map(bar => <Typography><Item>{bar}</Item></Typography>)}
            </Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
