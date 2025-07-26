import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { fetchAPI } from "./fetch";

export const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export const googleOAuth = async (startSSOFlow: any) => {
  try {
    // Start the authentication process by calling `startSSOFlow()`
    const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
      strategy: "oauth_google",
      // For web, defaults to current path
      // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
      // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
      redirectUrl: AuthSession.makeRedirectUri({ path: "/(root)/(tabs)/home" }),
    });

    // If sign in was successful, set the active session
    if (createdSessionId) {
      if (setActive) {
        setActive!({ session: createdSessionId });
        console.log("SignUp", signUp);
        if (signUp.createdUserId) {
          await fetchAPI("/(api)/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: `${signUp.createdUser?.firstName} ${signUp.createdUser?.lastName}`,
              email: signUp.createdUser?.emailAddresses[0].emailAddress,
              clerkId: signUp.createdUserId,
            }),
          });
        }
        return {
          success: true,
          code: "success",
          message: "You have successfully authenticated.",
        };
      }
    }
    return {
      success: false,
      code: "failed",
      message: "You have failed to authenticate.",
    };
  } catch (err: any) {
    console.error(JSON.stringify(err, null, 2));
    return {
      success: false,
      code: err.errors[0]?.code,
      message: err?.errors[0]?.longMessage,
    };
  }
};
