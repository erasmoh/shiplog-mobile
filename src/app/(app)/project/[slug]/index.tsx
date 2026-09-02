import { Stack, router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Timeline } from "@/components/timeline";
import { Badge, Button, Centered, ErrorText, Muted } from "@/components/ui";
import { STATUS_LABEL, type ProjectStatus } from "@/lib/constants";
import { supabase, type Entry, type Project } from "@/lib/supabase";
import { colors, spacing } from "@/lib/theme";
import { useQuery } from "@/lib/use-query";

type Data = { project: Project; entries: Entry[] };

export default function ProjectScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const { data, error, loading, refetch } = useQuery<Data>(async () => {
    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) return { data: null, error };
    if (!project) return { data: null, error: { message: "Proyecto no encontrado" } };
    const { data: entries, error: eErr } = await supabase
      .from("entries")
      .select("*")
      .eq("project_id", project.id)
      .order("shipped_at", { ascending: false })
      .order("created_at", { ascending: false });
    if (eErr) return { data: null, error: eErr };
    return { data: { project, entries: entries ?? [] }, error: null };
  }, slug);

  return (
    <>
      <Stack.Screen
        options={{
          title: data?.project.name ?? "",
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => router.push(`/project/${slug}/edit`)}
            >
              <Text style={styles.headerLink}>Editar</Text>
            </Pressable>
          ),
        }}
      />
      {loading && !data ? (
        <Centered>
          <ActivityIndicator />
        </Centered>
      ) : error || !data ? (
        <View style={{ padding: spacing.md }}>
          <ErrorText>{error ?? "Proyecto no encontrado"}</ErrorText>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.meta}>
            <Badge
              label={STATUS_LABEL[data.project.status as ProjectStatus] ?? data.project.status}
              bg={colors.border}
              fg={colors.text}
            />
            {data.project.description ? <Muted>{data.project.description}</Muted> : null}
          </View>
          <Button
            title="Registrar ship"
            onPress={() => router.push(`/project/${slug}/entry/new`)}
          />
          {data.entries.length === 0 ? (
            <Centered>
              <Muted>Sin entradas todavía. Registra tu primer ship.</Muted>
            </Centered>
          ) : (
            <Timeline entries={data.entries} projectSlug={slug} />
          )}
          <Button title="Actualizar" variant="ghost" onPress={refetch} />
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, gap: spacing.md },
  meta: { gap: spacing.sm },
  headerLink: { color: colors.muted, fontSize: 15 },
});
