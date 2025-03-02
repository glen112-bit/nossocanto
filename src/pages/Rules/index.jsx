import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import data from '../../assets/data.json';
import Stack from '@mui/material/Stack';
import { Item } from '../../components/Item'

export default function Rules() {
    let Regras = data.rules
  return (
    <div>
      <h1>Regras do NossoCanto</h1>
      <Accordion>
        <AccordionSummary
         className='title'
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
            <Stack spacing={2}>
              <Typography component="span"><Item>Regras da Casa</Item></Typography>
            </Stack>
        </AccordionSummary>
        <AccordionDetails>
            <Stack spacing={2}>{Regras.map(rules => <Typography><Item>{rules}</Item></Typography>)}</Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
