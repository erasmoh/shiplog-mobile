import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Badge, Card, Muted } from "@/components/ui";
import { KIND_COLOR, KIND_LABEL, type EntryKind } from "@/lib/constants";
import type { Entry } from "@/lib/supabase";
import { colors, spacing } from "@/lib/theme";
import { groupByWeek, weekLabel } from "@/lib/week";

export function Timeline({
  entries,
  projectSlug,
}: {
  entries: Entry[];
  projectSlug: string;
}) {
  const weeks = groupByWeek(entries);

  return (
    <View style={styles.weeks}>
      {weeks.map((w) => (
        <View key={w.key} style={styles.week}>
          <View style={styles.weekHeader}>
            <Text style={styles.weekTitle}>{weekLabel(w.week)}</Text>
            <Muted>
              {w.items.length} {w.items.length === 1 ? "ship" : "ships"}
            </Muted>
          </View>
          {w.items.map((e) => {
            const kind = e.kind as EntryKind;
            const color = KIND_COLOR[kind] ?? KIND_COLOR.other;
            return (
              <Link
                key={e.id}
                href={`/project/${projectSlug}/entry/${e.id}`}
                asChild
              >
                <Pressable accessibilityRole="button">
                  <Card>
                    <View style={styles.row}>
                      <Muted>{e.shipped_at}</Muted>
                      <Badge
                        label={KIND_LABEL[kind] ?? e.kind}
                        bg={color.bg}
                        fg={color.fg}
                      />
                    </View>
                    <Text style={styles.title}>{e.title}</Text>
                    {e.body ? <Text style={styles.body}>{e.body}</Text> : null}
                    {e.tags.length ? (
                      <Text style={styles.tags}>
                        {e.tags.map((t) => `#${t}`).join("  ")}
                      </Text>
                    ) : null}
                  </Card>
                </Pressable>
              </Link>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  weeks: { gap: spacing.lg },
  week: { gap: spacing.sm },
  weekHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  weekTitle: { fontSize: 15, fontWeight: "700", color: colors.text },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 16, fontWeight: "600", color: colors.text },
  body: { fontSize: 14, color: colors.text },
  tags: { fontSize: 12, color: colors.muted },
});
