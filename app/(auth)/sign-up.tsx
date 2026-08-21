import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignUp() {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState("");

  const isSubmitting = fetchStatus === "fetching";

  const onSignUpPress = async () => {
    setError("");

    const { error } = await signUp.create({ emailAddress, password });
    if (error) {
      setError(
        error.longMessage ||
          error.message ||
          "Something went wrong. Please try again.",
      );
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      setError(
        sendError.longMessage ||
          sendError.message ||
          "Something went wrong. Please try again.",
      );
      return;
    }

    setPendingVerification(true);
  };

  const onVerifyPress = async () => {
    setError("");

    const { error } = await signUp.verifications.verifyEmailCode({
      code,
    });

    if (error) {
      setError(
        error.longMessage ||
          error.message ||
          "Verification failed. Please try again.",
      );
      return;
    }

    if (signUp.status === "complete") {
      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        setError(finalizeError.message || "Failed to finalize session.");
        return;
      }
      router.replace("/(tabs)");
    } else {
      setError("Verification could not be completed. Please try again.");
    }
  };

  // Verification code screen
  if (pendingVerification) {
    const isVerifyDisabled = !code || isSubmitting;

    return (
      <SafeAreaView className="auth-safe-area">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="auth-screen"
        >
          <ScrollView
            className="auth-scroll"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="auth-content">
              {/* Brand Block */}
              <View className="auth-brand-block">
                <View className="auth-logo-wrap">
                  <View className="auth-logo-mark">
                    <Text className="auth-logo-mark-text">R</Text>
                  </View>
                  <View>
                    <Text className="auth-wordmark">React Native</Text>
                    <Text className="auth-wordmark-sub">SMART BILLING</Text>
                  </View>
                </View>

                <Text className="auth-title">Verify your email</Text>
                <Text className="auth-subtitle">
                  We sent a verification code to {emailAddress}
                </Text>
              </View>

              {/* Verification Card */}
              <View className="auth-card">
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Verification code</Text>
                    <TextInput
                      className={`auth-input ${error ? "auth-input-error" : ""}`}
                      placeholder="Enter the 6-digit code"
                      placeholderTextColor="rgba(0,0,0,0.35)"
                      value={code}
                      onChangeText={setCode}
                      keyboardType="number-pad"
                      editable={!isSubmitting}
                    />
                  </View>

                  {error ? <Text className="auth-error">{error}</Text> : null}

                  <TouchableOpacity
                    className={`auth-button ${isVerifyDisabled ? "auth-button-disabled" : ""}`}
                    onPress={onVerifyPress}
                    disabled={isVerifyDisabled}
                    activeOpacity={0.8}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Verify email</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Sign-up form
  const isDisabled = !emailAddress || !password || isSubmitting;

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="auth-screen"
      >
        <ScrollView
          className="auth-scroll"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content">
            {/* Brand Block */}
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">React Native</Text>
                  <Text className="auth-wordmark-sub">SMART BILLING</Text>
                </View>
              </View>

              <Text className="auth-title">Create account</Text>
              <Text className="auth-subtitle">
                Start managing all your subscriptions in one place
              </Text>
            </View>

            {/* Auth Card */}
            <View className="auth-card">
              <View className="auth-form">
                {/* Email Field */}
                <View className="auth-field">
                  <Text className="auth-label">Email</Text>
                  <TextInput
                    className={`auth-input ${error ? "auth-input-error" : ""}`}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    editable={!isSubmitting}
                  />
                </View>

                {/* Password Field */}
                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    className={`auth-input ${error ? "auth-input-error" : ""}`}
                    placeholder="Create a password"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    textContentType="newPassword"
                    editable={!isSubmitting}
                  />
                  <Text className="auth-helper">
                    Must be at least 8 characters
                  </Text>
                </View>

                {/* Error */}
                {error ? <Text className="auth-error">{error}</Text> : null}

                {/* Sign Up Button */}
                <TouchableOpacity
                  className={`auth-button ${isDisabled ? "auth-button-disabled" : ""}`}
                  onPress={onSignUpPress}
                  disabled={isDisabled}
                  activeOpacity={0.8}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#081126" />
                  ) : (
                    <Text className="auth-button-text">Create account</Text>
                  )}
                </TouchableOpacity>

                {/* CAPTCHA container for Expo web */}
                <View nativeID="clerk-captcha" />
              </View>
            </View>

            {/* Link to Sign In */}
            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity>
                  <Text className="auth-link">Sign in</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
