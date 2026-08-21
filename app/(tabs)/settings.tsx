import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  const displayName =
    user?.fullName || user?.primaryEmailAddress?.emailAddress || "User";
  const avatarUrl = user?.imageUrl;

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="list-title mb-6">Settings</Text>

      {/* User Profile Section */}
      <View className="sub-card mb-4">
        <View className="sub-head">
          <View className="sub-main">
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                className="home-avatar"
              />
            ) : (
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View className="sub-copy">
              <Text className="sub-title">{displayName}</Text>
              {user?.primaryEmailAddress?.emailAddress && (
                <Text className="sub-meta">
                  {user.primaryEmailAddress.emailAddress}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        className="sub-cancel"
        onPress={handleSignOut}
        activeOpacity={0.8}
      >
        <Text className="sub-cancel-text">Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default Settings;
