import { useNavigation } from "@react-navigation/native";
import { Alert,FlatList } from "react-native";
import dayjs from "dayjs";

import { Historic } from "../../libs/realm/schemas/Historic";
import { useEffect, useState } from "react";

import { useQuery,useRealm } from "../../libs/realm";

import { CarStatus } from "../../components/CarStatus";
import { HistoricCard, HistoricCardProps } from "../../components/HistoricCard";

import { HomeHeader } from "../HomeHeader";
import { Container, Content, Label, Title } from "./styles";


export function Home() {

  const [vehicleInUse,setVehicleInUse]= useState<Historic | null>(null);
  const [vehicleHistoric,setVehicleHistoric]= useState<HistoricCardProps[]>([]);
  const {navigate}= useNavigation();

  const realm= useRealm();

  const historic= useQuery(Historic);

  function handleRegisterMoviment(){
    if(vehicleInUse?._id){
      return navigate('arrival', {id:vehicleInUse._id.toString()});
    }else{
      navigate('departure');
    }
  }

  function fetchVehicleInUse(){
    try{
      const vehicle= historic.filtered("status = 'departure'")[0];
      setVehicleInUse(vehicle);
    }catch(error){
      Alert.alert('Veiculo em uso','Não foi possivel carregar o veiculo em uso')
    }
  }

  function fetchHistoric(){
    try{
      const response= historic.filtered("status = 'arrival' SORT (created_at DESC)");

      const formattedHistoric= response.map((item)=>{
        return({
          id: item._id.toString(),
          licensePlate: item.license_plate,
          isSync:false,
          created: dayjs(item.created_at).format('[Saída em] DD/MM/YYYY [às] HH:mm'),
        });
      });

      setVehicleHistoric(formattedHistoric);
    }catch(error){
      console.log(error)
      Alert.alert('Histórico','Não foi possível carregar o histórico')
    }
  }

  function handleHistoricDetails(id:string){
    navigate('arrival', {id});
  }

  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  useEffect(() => {
    realm.addListener("change", () => fetchVehicleInUse());

    return () => realm.removeListener("change", () => fetchVehicleInUse());
  }, []);

  useEffect(() => {
    fetchHistoric();
  },[historic]);

  return (
    <Container>
      <HomeHeader />
      <Content>
        <CarStatus
          licensePlate={vehicleInUse?.license_plate}
          onPress={handleRegisterMoviment}
        />

        <Title>
          Histórico
        </Title>

        <FlatList
          data={vehicleHistoric}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => 
          <HistoricCard data={item} 
          onPress={() => handleHistoricDetails(item.id)}/>}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100
          }}
          ListEmptyComponent={(
            <Label>
              Nenhum veículo encontrado
            </Label>
          )}
        />
      </Content>
    </Container>
  );
}
