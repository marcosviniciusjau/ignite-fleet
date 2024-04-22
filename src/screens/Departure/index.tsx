import { useRef, useState } from 'react';
import { TextInput,ScrollView, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useNavigation } from '@react-navigation/native';

import { useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { useUser } from '@realm/react';

import { licensePlateValidate } from '../../utils/licensePlateValidate';

import { Container, Content } from './styles';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Button } from '../../components/Button';

export function Departure() {
  const [description,setDescription]= useState('');
  const [licensePlate,setLicensePlate]= useState('');

  const [isRegistering,setIsRegistering]= useState(false);

  const {goBack}= useNavigation();

  const realm = useRealm();
  const user = useUser();

  const descriptionRef= useRef<TextInput>(null);
  const licensePlateRef= useRef<TextInput>(null);

  function handleDepartureRegister() {
    try{
      if(!licensePlateValidate(licensePlate)){
        licensePlateRef.current?.focus();
        return Alert.alert('Placa inválida', 'A Placa é inválida');
      }
      if(description.trim().length === 0){
        descriptionRef.current?.focus();
        return Alert.alert('Finalidade inválida', 'A Finalidade é inválida');
      }

      setIsRegistering(true);

      realm.write(()=>{
        realm.create('Historic',Historic.generate({
          user_id: user!.id,
          license_plate: licensePlate.toUpperCase(),
          description
        }));
      });

      Alert.alert('Saída', 'Sua saída do veículo registrada com sucesso');
      goBack();

    }catch(error){
      console.log(error);
      Alert.alert('Erro', 'Ocorreu um erro ao registrar a saída');
      setIsRegistering(false);
    }
  }

  return (
    <Container>
      <Header title="Saída"/>

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          <Content>
            <LicensePlateInput
              ref={licensePlateRef}
              label="Placa do veículo"
              placeholder="BRA-1234"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType="next"
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              ref={descriptionRef}
              label="Finalidade"
              placeholder="Escreva sua finalidade"
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              blurOnSubmit
              onChangeText={setDescription}
            />

            <Button
            title="Registrar Saída"
            isLoading={isRegistering}
            onPress={handleDepartureRegister}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  );
}