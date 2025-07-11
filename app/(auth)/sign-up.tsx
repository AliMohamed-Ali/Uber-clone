import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useSignUp } from "@clerk/clerk-expo";
import { TokenCreateParams } from "@stripe/stripe-js";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";
import Verification = TokenCreateParams.Account.Company.Verification;
const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerification({ ...verification, state: "pending" });
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      if (signUpAttempt.status === "complete") {
        await fetch("/(api)/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: signUpAttempt.createdUserId,
          }),
        });
        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification({ ...verification, state: "success" });
      } else {
        setVerification({
          ...verification,
          state: "failed",
          error: "Verification failed",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        state: "failed",
        error: err.errors[0].longMessage,
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account{" "}
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter your name"
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
            icon={icons.person}
          />
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
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />
          <OAuth />
          <Link
            href="/sign-in"
            className="text-lg text-center mt-10 text-general-200"
          >
            <Text>Already Have an account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>
        <ReactNativeModal
          isVisible={
            verification.state === "pending" || verification.state === "failed"
          }
          onModalHide={() => {
            if (verification.state === "success") setShowSuccessModal(true);
          }}
        >
          <View className="bg-white py-9 px-7 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-2">
              We have send a verification code to your {form.email}
            </Text>
            <InputField
              label="Code"
              icon={icons.lock}
              placeholder="1234"
              value={verification.code}
              onChangeText={(value) =>
                setVerification({ ...verification, code: value })
              }
              keyboardType="numeric"
            />
            {verification.error && (
              <Text className="text-red-500 mt-2 text-sm">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onVerifyPress}
              className="mt-6 bg-success-500"
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white py-9 px-7 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browser Home"
              onPress={() => {
                setShowSuccessModal(false);
                router.push("/(root)/(tabs)/home");
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
