import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    Typography, 
    Link,
    Accordion,
    AccordionDetails,
    AccordionSummary
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Stack from '@mui/material/Stack';
import { Item } from '../../components/Item'
import './style.css'

export const MyAccordion = ({Lugares, title, link }) => {
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
                    <Stack id={uuidv4()} sx={{width:'90vw', fontSize: '26px'}}>
                        {Lugares.map((lugar ) => 
                        <Accordion>
                            <AccordionSummary

                                sx={{ backgroundColor: 'rgba(224, 224, 235, 002)'}}
                                expandIcon={<ArrowDropDownIcon />}
                                key={uuidv4()}
                            ><Stack key={uuidv4()} sx={{fontSize: '36px'}} >
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
                                        sx={{ backgroundColor: 'rgba(224, 224, 235, 002)'}}
                                        expandIcon={<ArrowDropDownIcon />}
                                        key={uuidv4()}
                                    ><Stack sx={{fontSize: '20px'}} >
                                        Endereco
                                    </Stack>
                                    </AccordionSummary>

                                    <AccordionDetails
                                        sx={{ backgroundColor: 'rgba(224, 224, 235, 002)'}}
                                    >
                                        <Stack sx={{fontSize: '20px', fontWeight: '300'}}spacing={2}>
                                            <Link href={link + lugar.endereco} target={"blanck"} >{lugar.endereco}</Link>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>                                :
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
