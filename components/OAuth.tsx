import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { googleOAuth } from "@/lib/auth";
import { useSSO } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useCallback } from "react";
import { Image, Text, View } from "react-native";

const OAuth = () => {
  const { startSSOFlow } = useSSO();
  const handleGoogleSignIn = useCallback(async () => {
    try {
      const result = await googleOAuth(startSSOFlow);
      if (result.code === "session_exists" || result.code === "success") {
        return router.push("/(root)/(tabs)/home");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>
      <CustomButton
        title="Log In With Google"
        IconLeft={() => (
          <Image
            source={icons.google}
            className="w-5 h-5 mx-2"
            resizeMode="contain"
          />
        )}
        className="mt-5 w-full shadow-none "
        onPress={handleGoogleSignIn}
        bgVariant="outline"
        textVariant="primary"
      />
    </View>
  );
};

export default OAuth;
