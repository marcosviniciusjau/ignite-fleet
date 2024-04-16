import React from 'react';
import { Container, Content } from './styles';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';

export function Departure() {
  return (
    <Container>
      <Header title="Saída"/>
      <Content>
        <LicensePlateInput 
        label="Placa do veículo"
        placeholder="BRA-1234"/>
        <TextAreaInput label="Finalidade"
        placeholder="Escreva sua finalidade"/>
      </Content>
     
    </Container>
  );
}