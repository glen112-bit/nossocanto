
import * as React from 'react';
import {  MyAccordion } from '../../components';
import myData from '../../assets/myData.json';
import './style.css'

export default function Places() {
    let Lugares = myData.places
    let Bares = myData.bares
    let Mercados = myData.mercados
    let Padarias = myData.padarias

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
