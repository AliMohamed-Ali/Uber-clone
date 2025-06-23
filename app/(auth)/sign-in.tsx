import { Text, ScrollView, View, Image, Alert } from "react-native";
import { useState } from "react";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignIn } from "@clerk/clerk-expo";
const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [form, setForm] = useState({ email: "", password: "" });
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        Alert.alert("Error occured");
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (err.message === "You're already signed in.") {
        router.push("/(root)/(tabs)/home");
      }
      Alert.alert("Error occured", err.errors[0].longMessage);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Welcome 👋
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter your email"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
            icon={icons.email}
            autoCapitalize="none"
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            value={form.password}
            secureTextEntry={true}
            onChangeText={(value) => setForm({ ...form, password: value })}
            icon={icons.lock}
          />
          <CustomButton
            title="Log In"
            onPress={onSignInPress}
            className="mt-6"
          />
          <OAuth />
          <Link
            href="/sign-up"
            className="text-lg text-center mt-10 text-general-200"
          >
            <Text>Don't have an account? </Text>
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
