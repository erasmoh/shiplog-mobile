import { Stack, router } from "expo-router";
import { ScrollView } from "react-native";
import { ProjectForm } from "@/components/project-form";
import { spacing } from "@/lib/theme";

export default function NewProjectScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Nuevo proyecto" }} />
      <ScrollView
        contentContainerStyle={{ padding: spacing.md }}
        keyboardShouldPersistTaps="handled"
      >
        <ProjectForm onSaved={(slug) => router.replace(`/project/${slug}`)} />
      </ScrollView>
    </>
  );
}
