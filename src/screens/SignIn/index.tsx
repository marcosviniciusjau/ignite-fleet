import { Container, Title, Slogan} from './styles';

import {GoogleSignin} from "@react-native-google-signin/google-signin"
import backgroundImg from '../../assets/background.png';
import { Button } from '../../components/Button';

import { WEB_CLIENT_ID,IOS_CLIENT_ID } from '@env';
import { useState } from 'react';
import { Alert } from 'react-native';

GoogleSignin.configure({
  scopes:["email","profile"],
  webClientId:WEB_CLIENT_ID,
  iosClientId:IOS_CLIENT_ID,
})

export  function SignIn() {
  const [isAuthenticating,setIsAuthenticating] = useState(false)

  async function handleGoogleSignIn() {
    try {
      setIsAuthenticating(true)
      
      const {idToken}= await GoogleSignin.signIn()
      
      if(idToken){
      } else{
        Alert.alert('Error', "Não foi possível realizar o login")
        setIsAuthenticating(false)
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Error', "Não foi possivel realizar o login")
      setIsAuthenticating(false)
    }
  }
  return (
    <Container source={backgroundImg}>

      <Title>Ignite Fleet</Title>
      
      <Slogan>Gestão de uso de veículos</Slogan>

      <Button 
        isLoading={isAuthenticating}
        onPress={handleGoogleSignIn}
        title="Entrar com Google" />

    </Container>
  );
}

