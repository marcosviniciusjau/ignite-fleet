import MapView, {PROVIDER_GOOGLE, MapViewProps,LatLng, Marker, Polyline} from "react-native-maps";
import { IconBox } from "../IconBox";
import { faCar, faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "styled-components/native";

type Props= MapViewProps&{
    coordinates: LatLng[]
}

export function Map({coordinates,...rest}:Props) {
    const {COLORS}= useTheme();
    const lastCoordinate = coordinates[coordinates.length - 1];

    return(
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{width: '100%', height: 200}}
          region={{
            latitude: lastCoordinate.latitude,
            longitude: lastCoordinate.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        }}
        {...rest}
        >

<Marker identifier="departure" coordinate={{ latitude: coordinates[0].latitude, longitude: coordinates[0].longitude }}>
        <IconBox size="SMALL" icon={faCar} />
      </Marker>

{coordinates.length > 1 && (
  <>
    <Marker identifier="arrival" coordinate={{ latitude: lastCoordinate.latitude, longitude: lastCoordinate.longitude }}>
      <IconBox size="SMALL" icon={faFlagCheckered} />
    </Marker>

    <Polyline
      coordinates={[...coordinates.map(coordinate => ({ latitude: coordinate.latitude, longitude: coordinate.longitude }))]}
      strokeColor={COLORS.GRAY_700}
      strokeWidth={7}
    />
  </>
)}
        </MapView>
    )
}