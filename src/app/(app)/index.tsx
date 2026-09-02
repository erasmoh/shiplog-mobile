import { Link, Stack, router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Badge, Button, Card, Centered, ErrorText, Muted } from "@/components/ui";
import { STATUS_LABEL, type ProjectStatus } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { colors, spacing } from "@/lib/theme";
import { useQuery } from "@/lib/use-query";

type Row = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  entries: { count: number }[];
};

export default function ProjectsScreen() {
  const { data, error, loading, refetch } = useQuery<Row[]>(
    () =>
      supabase
        .from("projects")
        .select("id, name, slug, description, status, entries(count)")
        .order("created_at", { ascending: false }),
    "projects",
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Proyectos",
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              onPress={() => supabase.auth.signOut()}
              hitSlop={8}
            >
              <Text style={styles.headerLink}>Salir</Text>
            </Pressable>
          ),
        }}
      />
      <FlatList
        data={data ?? []}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={refetch}
        ListHeaderComponent={
          <View style={styles.header}>
            <ErrorText>{error}</ErrorText>
            <Button
              title="Nuevo proyecto"
              onPress={() => router.push("/project/new")}
            />
          </View>
        }
        ListEmptyComponent={
          loading ? null : (
            <Centered>
              <Muted>Aún no tienes proyectos. Crea el primero.</Muted>
            </Centered>
          )
        }
        renderItem={({ item }) => (
          <Link href={`/project/${item.slug}`} asChild>
            <Pressable accessibilityRole="button">
              <Card>
                <View style={styles.row}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Badge
                    label={STATUS_LABEL[item.status as ProjectStatus] ?? item.status}
                    bg={colors.border}
                    fg={colors.text}
                  />
                </View>
                {item.description ? <Muted>{item.description}</Muted> : null}
                <Muted>
                  {item.entries[0]?.count ?? 0}{" "}
                  {item.entries[0]?.count === 1 ? "ship" : "ships"}
                </Muted>
              </Card>
            </Pressable>
          </Link>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, gap: spacing.sm },
  header: { gap: spacing.sm, marginBottom: spacing.sm },
  headerLink: { color: colors.muted, fontSize: 15 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.sm },
  name: { fontSize: 17, fontWeight: "600", color: colors.text, flex: 1 },
});
