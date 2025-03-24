
import * as React from 'react';
import {  MyAccordion } from '../../components'
import data from '../../assets/data.json';
import './style.css'

export default function Places() {
    let Lugares = data.places
    let Bares = data.bares
    let Mercados = data.mercados
    let Padarias = data.padarias

    var mylink = "https://www.google.com.br/maps/dir/R.+Martins+Fontes,+164+-+Consolação,+São+Paulo+-+SP,+01050-000,+Brasil/"

    // let Descricoes = data.descricoes
    return (
        <div>
            <h1>Lugares Perto</h1>
            <MyAccordion Lugares={ Lugares } title='Pontos Turisticos' link = { mylink }></MyAccordion>
            <MyAccordion Lugares={ Bares } title='Bares e Baladas' link = { mylink }></MyAccordion>
            <MyAccordion Lugares={ Mercados } title='Mercados' link = { mylink }></MyAccordion>
            <MyAccordion Lugares={ Padarias } title='Onde Comer' link = { mylink }></MyAccordion>
        </div>
    );
}
