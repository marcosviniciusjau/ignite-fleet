import { useNavigation } from "@react-navigation/native";
import { Alert,FlatList } from "react-native";
import Toast from "react-native-toast-message";
import dayjs from "dayjs";

import { Historic } from "../../libs/realm/schemas/Historic";
import { useEffect, useState } from "react";
import { useUser } from "@realm/react";

import { useQuery,useRealm } from "../../libs/realm";

import { CarStatus } from "../../components/CarStatus";
import { HistoricCard, HistoricCardProps } from "../../components/HistoricCard";

import { HomeHeader } from "../HomeHeader";
import { Container, Content, Label, Title } from "./styles";
import { getLastAsync, saveLastSync } from "../../libs/asyncStorage/SyncStorage";
import { TopMessage } from "../../components/TopMessage";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

export function Home() {

  const [vehicleInUse,setVehicleInUse]= useState<Historic | null>(null);
  const [vehicleHistoric,setVehicleHistoric]= useState<HistoricCardProps[]>([]);
  const [percentageToSync,setPercentageToSync]= useState<string | null>(null)
  const {navigate}= useNavigation();

  const realm= useRealm();
  const user= useUser();

  const historic= useQuery(Historic);

  function handleRegisterMoviment() {
    if(vehicleInUse?._id) {
      navigate('arrival', { id: vehicleInUse._id.toString() });
    } else {
      navigate('departure')
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

  const fetchHistoric = async () => {
    try {
      if(!realm.isClosed) {
        const response = historic.filtered("status='arrival' SORT(created_at DESC)");

        const lastSync = await getLastAsync();
      
        const formattedHistoric = response.map((item) => {
          return ({
            id: item._id.toString(),
            licensePlate: item.license_plate,
            isSync: lastSync > item.updated_at!.getTime(),
            created: dayjs(item.created_at).format('[Saída em] DD/MM/YYYY [às] HH:mm')
          })
        })
        setVehicleHistoric(formattedHistoric);
    }
    } catch (error) {
      console.log("deu esse erro",error);
    }
  }

  function handleHistoricDetails(id: string) {
    navigate('arrival', { id })
  }

  async function progressNotification(transferred: number, transferable: number) {
    const percentage= (transferred/transferable) * 100;

    if(percentage === 100){
      await saveLastSync();
      await fetchHistoric();
      setPercentageToSync(null);

      Toast.show({
        type: 'info',
        text1: 'Todos os dados estão sincronizados',
      });
    }
    if(percentage < 100){
      setPercentageToSync(`${percentage.toFixed(2)}% sincronizado.`);
    }

  }

  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  useEffect(() => {
    realm.addListener("change", () => fetchVehicleInUse());

    return () => {
      if(realm && !realm.isClosed){
        realm.removeListener("change", () => fetchVehicleInUse());
      }
    };
  }, []);

  useEffect(() => {
    fetchHistoric();
  },[historic]);

  useEffect(() => {
    realm.subscriptions.update((mutableSubs,realm) => {
      const historicByUser= realm.objects('Historic').filtered(`user_id - '${user!.id}'`);

      mutableSubs.add(historicByUser, {name: 'historic_by_user'});

    })
  },[realm])

  useEffect(() => { 
    const syncSession= realm.syncSession;

    if (!syncSession) {
      return;
    }

    syncSession.addProgressNotification(
      Realm.ProgressDirection.Upload,
      Realm.ProgressMode.ReportIndefinitely,
      progressNotification
    );

    return ()=> syncSession.removeProgressNotification(progressNotification)
  },[]);

  return (
    <Container>

      {
        percentageToSync && <TopMessage title={percentageToSync} icon={faCloudArrowUp}/>
      }
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
