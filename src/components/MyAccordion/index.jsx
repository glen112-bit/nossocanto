import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Stack from '@mui/material/Stack';
import { Item } from '../../components/Item'
import './style.css'

export const MyAccordion = ({Lugares, title }) => {
    return(
        <>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel4-content"
                    id="panel1-header"
                >
                    <Typography>
                        <Item>
                            {title}
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
                                <Stack sx={{fontSize: '20px', fontWeight: '300'}}spacing={2}>
                                    <Stack>{lugar.value}</Stack>
                                </Stack>
                            </AccordionDetails>
                            {lugar.endereco ? 
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ArrowDropDownIcon />}
                                        key={lugar[index]}
                                    ><Stack sx={{fontSize: '20px'}} >
                                        Endereco
                                    </Stack>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        <Stack sx={{fontSize: '20px', fontWeight: '300'}}spacing={2}>
                                            <Stack>{lugar.endereco}</Stack>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                                :
                                null
                            }
                        </Accordion>
                        )}

                    </Stack>    
                </AccordionSummary>
            </Accordion>

        </>
    )
}
