import { Stack, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from "react-native";
import { ProjectForm } from "@/components/project-form";
import { Button, Centered, ErrorText } from "@/components/ui";
import { isStatus } from "@/lib/constants";
import { supabase, type Project } from "@/lib/supabase";
import { spacing } from "@/lib/theme";
import { useQuery } from "@/lib/use-query";

export default function EditProjectScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { data, error, loading } = useQuery<Project>(
    () => supabase.from("projects").select("*").eq("slug", slug).single(),
    slug,
  );

  function confirmDelete(project: Project) {
    Alert.alert(
      "Eliminar proyecto",
      `Se borrará "${project.name}" y todas sus entradas. Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("projects")
              .delete()
              .eq("id", project.id);
            if (error) setDeleteError(error.message);
            else router.dismissTo("/");
          },
        },
      ],
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Editar proyecto" }} />
      {loading && !data ? (
        <Centered>
          <ActivityIndicator />
        </Centered>
      ) : !data ? (
        <ErrorText>{error ?? "Proyecto no encontrado"}</ErrorText>
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ProjectForm
            initial={{
              id: data.id,
              name: data.name,
              description: data.description,
              repo_url: data.repo_url,
              status: isStatus(data.status) ? data.status : "active",
              is_public: data.is_public,
            }}
            onSaved={(newSlug) => router.dismissTo(`/project/${newSlug}`)}
          />
          <ErrorText>{deleteError}</ErrorText>
          <Button
            title="Eliminar proyecto"
            variant="danger"
            onPress={() => confirmDelete(data)}
          />
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, gap: spacing.lg },
});
