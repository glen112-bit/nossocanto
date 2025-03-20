
import * as React from 'react';
import { 
    TextField, 
    Accordion, 
    AccordionDetails, 
    AccordionSummary, 
    Typography, 
    Stack, 
    Link 
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Item } from '../../components'
import { v4 as uuidv4 } from 'uuid';
import data from '../../assets/data.json';
import './style.css'

export default function Places() {
    let Lugares = data.places
    let Bares = data.bares
    let Mercados = data.mercados
    let Padarias = data.padarias

    var mylink = "https://www.google.com.br/maps/dir/R.+Martins+Fontes,+164+-+Consolação,+São+Paulo+-+SP,+01050-000,+Brasil/"
    var mylink2 = ''
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
                    // sx={{border: '6px solid blue'}}
                    aria-controls="panel4-content"
                    id="panel1-header"
                >
                    <Stack sx={{width:'90vw', fontSize: '26px'}}>
                        {Lugares.map((lugar, index) => 
                        <Accordion>
                            <AccordionSummary
                                sx={{backgroundColor: 'rgba(224, 224, 235, 002)'}}

                                id={uuidv4()}
                                expandIcon={<ArrowDropDownIcon />}
                                key={lugar[index]}
                            ><Stack sx={{fontSize: '36px'}} >
                                {lugar.name}
                            </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack id={uuidv4()}sx={{fontSize: '20px', fontWeight: '300'}}spacing={2}>
                                    <Stack id={uuidv4()}>{lugar.value}</Stack>
                                </Stack>
                            </AccordionDetails>
                            {lugar.endereco ? 
                                <Accordion>
                                    <AccordionSummary
                                        sx={{ backgroundColor: 'rgba(224, 224, 235, 002)'}}
                                        expandIcon={<ArrowDropDownIcon />}
                                        key={lugar[index]}
                                    ><Stack sx={{fontSize: '20px', backgroundColor: 'rgba(224, 224, 235, 002)'}} >
                                        Endereco
                                    </Stack>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{ backgroundColor: 'rgba(224, 224, 235, 002)' }}>
                                        <Stack sx={{fontSize: '20px', fontWeight: '300'}}spacing={2}>
                                            <Link href={mylink + lugar.endereco} target={"blanck"} >{lugar.endereco}</Link>
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
                    <Stack id={uuidv4()}sx={{width:'90vw', fontSize: '26px'}}>
                        {Bares.map((bar, index) => 
                        <Accordion>
                            <AccordionSummary
                                sx={{backgroundColor: 'rgba(224, 224, 235, 002)'}}
                                expandIcon={<ArrowDropDownIcon />}
                                key={bar[index]}
                            ><Stack id={uuidv4()}sx={{fontSize: '36px'}} >
                                {bar.name}
                            </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack id={uuidv4()}spacing={2}>
                                    <Stack id={uuidv4()}>{bar.value}</Stack>
                                </Stack>
                            </AccordionDetails>
                            {bar.endereco ? 
                                <Accordion>
                                    <AccordionSummary
                                        sx={{ backgroundColor: 'rgba(224, 224, 235, 002)'}}
                                        expandIcon={<ArrowDropDownIcon />}
                                        key={bar[index]}
                                    ><Stack id={uuidv4()}sx={{fontSize: '20px'}} >
                                        Endereco
                                    </Stack>
                                    </AccordionSummary>

                                    <AccordionDetails
                                        sx={{ backgroundColor: 'rgba(224, 224, 235, 002)'}}
                                    >
                                        <Stack id={uuidv4()}sx={{fontSize: '20px', fontWeight: '300'}}spacing={2}>
                                            <Link id={uuidv4()}href={mylink + bar.endereco} target={"blanck"} >{bar.endereco}</Link>
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

        <Accordion>
            <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel4-content"
                id="panel1-header"
            >
                <Typography>
                    <Item>
                        Mercados
                    </Item>
                </Typography>
            </AccordionSummary>
            <AccordionSummary
                aria-controls="panel4-content"
                id="panel1-header"
            >
                <Stack sx={{width:'90vw', fontSize: '26px'}}>
                    {Mercados.map((mercado, index) => 
                    <Accordion>
                        <AccordionSummary
                            sx={{ backgroundColor: 'rgba(224, 224, 235, 002)'}}
                            expandIcon={<ArrowDropDownIcon />}
                            key={mercado[index]}
                        ><Stack sx={{fontSize: '36px'}} >
                            {mercado.name}
                        </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack sx={{fontSize: '20px', fontWeight: '300'}}spacing={2}>
                                <Stack>{mercado.value}</Stack>
                            </Stack>
                        </AccordionDetails>
                        {mercado.endereco ? 
                            <Accordion>
                                <AccordionSummary
                                    sx={{ backgroundColor: 'rgba(224, 224, 235, 002)'}}
                                    expandIcon={<ArrowDropDownIcon />}
                                    key={mercado[index]}
                                ><Stack sx={{fontSize: '20px'}} >
                                    Endereco
                                </Stack>
                                </AccordionSummary>

                                <AccordionDetails
            sx={{ backgroundColor: 'rgba(224, 224, 235, 002)'}}
                                >
            <Stack sx={{fontSize: '20px', fontWeight: '300'}}spacing={2}>
                <Link href={mylink + mercado.endereco} target={"blanck"} >{mercado.endereco}</Link>
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
        <Accordion>
            <AccordionSummary

                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
            >
                <Typography>
                    <Item>
                        Onde Comer
                    </Item>
                </Typography>
            </AccordionSummary>
            <AccordionSummary
                aria-controls="panel4-content"
                id="panel1-header"
            >
                <Stack sx={{width:'90vw', fontSize: '26px'}}>
                    {Padarias.map((padaria, index) => 
                    <Accordion>
                        <AccordionSummary
                            sx={{ backgroundColor: 'rgba(224, 224, 235, 002)'}}
                            expandIcon={<ArrowDropDownIcon />}
                            key={padaria[index]}
                        ><Stack sx={{fontSize: '36px'}} >
                            {padaria.name}
                        </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={2}>
                                <Stack>{padaria.value}</Stack>
                            </Stack>
                        </AccordionDetails>
                        {padaria.endereco ? 
                            <Accordion>
                                <AccordionSummary
                                    sx={{ backgroundColor: 'rgba(224, 224, 235, 002)'}}
                                    expandIcon={<ArrowDropDownIcon />}
                                    key={padaria[index]}
                                ><Stack sx={{fontSize: '20px'}} >
                                    Endereco
                                </Stack>
                                </AccordionSummary>

                                <AccordionDetails
                                    sx={{ backgroundColor: 'rgba(224, 224, 235, 002)'}}
                                >
                                    <Stack sx={{fontSize: '20px', fontWeight: '300'}}spacing={2}>
                                        <Link href={mylink + padaria.endereco} target={"blanck"} >{padaria.endereco}</Link>
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
        </div>
    );
}
