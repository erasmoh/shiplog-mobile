import { Redirect, Stack } from "expo-router";
import { ActivityIndicator } from "react-native";
import { Centered } from "@/components/ui";
import { useSession } from "@/lib/session";
import { colors } from "@/lib/theme";

export default function AppLayout() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <Centered>
        <ActivityIndicator />
      </Centered>
    );
  }
  if (!session) return <Redirect href="/login" />;

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.text,
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: "minimal",
        contentStyle: { backgroundColor: colors.bg },
      }}
    />
  );
}
