import { Stack, router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView } from "react-native";
import { EntryForm } from "@/components/entry-form";
import { Centered, ErrorText } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { spacing } from "@/lib/theme";
import { useQuery } from "@/lib/use-query";

export default function NewEntryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data, error, loading } = useQuery<{ id: string }>(
    () => supabase.from("projects").select("id").eq("slug", slug).single(),
    slug,
  );

  return (
    <>
      <Stack.Screen options={{ title: "Registrar ship" }} />
      {loading && !data ? (
        <Centered>
          <ActivityIndicator />
        </Centered>
      ) : !data ? (
        <ErrorText>{error ?? "Proyecto no encontrado"}</ErrorText>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: spacing.md }}
          keyboardShouldPersistTaps="handled"
        >
          <EntryForm projectId={data.id} onSaved={() => router.back()} />
        </ScrollView>
      )}
    </>
  );
}
