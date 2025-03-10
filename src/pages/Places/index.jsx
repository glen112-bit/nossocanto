
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
    // let Descricoes = data.descricoes
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
                <AccordionSummary
                    aria-controls="panel4-content"
                    id="panel1-header"
                >
                    <Stack sx={{width:'90vw', fontSize: '26px'}}>
                        {Lugares.map((lugar, index) => 
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ArrowDropDownIcon />}
                                key={lugar[index]}
                            ><Stack sx={{fontSize: '36px'}} >
                                {lugar.name}
                            </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack spacing={2}>
                                    <Stack>{lugar.value}</Stack>
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                        )}

                    </Stack>    
                </AccordionSummary>
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
                <AccordionSummary
                    aria-controls="panel4-content"
                    id="panel1-header"
                >
                    <Stack sx={{width:'90vw', fontSize: '26px'}}>
                        {Bares.map((bar, index) => 
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ArrowDropDownIcon />}
                                key={bar[index]}
                            ><Stack sx={{fontSize: '36px'}} >
                                {bar.name}
                            </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack spacing={2}>
                                    <Stack>{bar.value}</Stack>
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                        )}
                    </Stack>    
                </AccordionSummary>

            </Accordion>
        </div>
    );
}
