import { Link, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>Subscription Details: {id}</Text>
      <Link href={'/'}>Back to Homepage</Link>
    </View>
  );
};
export default SubscriptionDetails;
