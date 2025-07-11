import { GoogleInputProps } from "@/types/type";
import { Text, View } from "react-native";

const GoogleTextInput = ({
  icon,
  containerStyle,
  onPress,
  initialLocation,
  textBackgroundColor,
}: GoogleInputProps) => (
  <View
    className={`flex flex-row items-center justify-center relative z-50 rounded-xl  ${containerStyle} mb-5`}
  >
    <Text>Search</Text>
  </View>
);

export default GoogleTextInput;
