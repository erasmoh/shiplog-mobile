import { Stack, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from "react-native";
import { EntryForm } from "@/components/entry-form";
import { Button, Centered, ErrorText } from "@/components/ui";
import { isKind } from "@/lib/constants";
import { supabase, type Entry } from "@/lib/supabase";
import { spacing } from "@/lib/theme";
import { useQuery } from "@/lib/use-query";

export default function EditEntryScreen() {
  const { id } = useLocalSearchParams<{ slug: string; id: string }>();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { data, error, loading } = useQuery<Entry>(
    () => supabase.from("entries").select("*").eq("id", id).single(),
    id,
  );

  function confirmDelete(entry: Entry) {
    Alert.alert("Borrar entrada", `¿Borrar "${entry.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Borrar",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.from("entries").delete().eq("id", entry.id);
          if (error) setDeleteError(error.message);
          else router.back();
        },
      },
    ]);
  }

  return (
    <>
      <Stack.Screen options={{ title: "Editar ship" }} />
      {loading && !data ? (
        <Centered>
          <ActivityIndicator />
        </Centered>
      ) : !data ? (
        <ErrorText>{error ?? "Entrada no encontrada"}</ErrorText>
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <EntryForm
            projectId={data.project_id}
            initial={{
              id: data.id,
              title: data.title,
              body: data.body,
              kind: isKind(data.kind) ? data.kind : "other",
              tags: data.tags,
              shipped_at: data.shipped_at,
            }}
            onSaved={() => router.back()}
          />
          <ErrorText>{deleteError}</ErrorText>
          <Button title="Borrar entrada" variant="danger" onPress={() => confirmDelete(data)} />
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, gap: spacing.lg },
});
