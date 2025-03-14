
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
                              {bar.endereco ? 
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ArrowDropDownIcon />}
                                        key={bar[index]}
                                    ><Stack sx={{fontSize: '20px'}} >
                                        Endereco
                                    </Stack>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        <Stack sx={{fontSize: '20px', fontWeight: '300'}}spacing={2}>
                                            <Link href={mylink + bar.endereco} target={"blanck"} >{bar.endereco}</Link>
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
                                        expandIcon={<ArrowDropDownIcon />}
                                        key={mercado[index]}
                                    ><Stack sx={{fontSize: '20px'}} >
                                        Endereco
                                    </Stack>
                                    </AccordionSummary>

                                    <AccordionDetails>
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
                                        expandIcon={<ArrowDropDownIcon />}
                                        key={padaria[index]}
                                    ><Stack sx={{fontSize: '20px'}} >
                                        Endereco
                                    </Stack>
                                    </AccordionSummary>

                                    <AccordionDetails>
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
