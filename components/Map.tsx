import { Text } from "react-native";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
const Map = () => {
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      style={{ flex: 1, width: "100%", height: "100%", borderRadius: 10 }}
      // initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      <Text>Maps</Text>
    </MapView>
  );
};

export default Map;
