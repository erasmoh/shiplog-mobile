import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, ErrorText, Field, Input, Segmented } from "@/components/ui";
import { ENTRY_KINDS, KIND_LABEL, type EntryKind } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/session";
import { spacing } from "@/lib/theme";

export type EntryInput = {
  title: string;
  body: string | null;
  kind: EntryKind;
  tags: string[];
  shipped_at: string;
};

type Props = {
  projectId: string;
  initial?: EntryInput & { id: string };
  onSaved: () => void;
};

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function parseTags(raw: string): string[] {
  return [
    ...new Set(
      raw
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    ),
  ].slice(0, 10);
}

export function EntryForm({ projectId, initial, onSaved }: Props) {
  const { session } = useSession();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [kind, setKind] = useState<EntryKind>(initial?.kind ?? "feature");
  const [tags, setTags] = useState(initial?.tags.join(", ") ?? "");
  const [shippedAt, setShippedAt] = useState(initial?.shipped_at ?? todayIso());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    const t = title.trim();
    if (!t) return setError("El título es obligatorio.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(shippedAt) || Number.isNaN(Date.parse(shippedAt)))
      return setError("La fecha debe tener formato AAAA-MM-DD.");
    if (!session) return setError("Sesión expirada.");

    setSaving(true);
    setError(null);
    const values = {
      title: t,
      body: body.trim() || null,
      kind,
      tags: parseTags(tags),
      shipped_at: shippedAt,
    };
    const { error } = initial
      ? await supabase.from("entries").update(values).eq("id", initial.id)
      : await supabase.from("entries").insert({
          ...values,
          project_id: projectId,
          user_id: session.user.id,
        });
    setSaving(false);
    if (error) return setError(error.message);
    onSaved();
  }

  return (
    <View style={styles.form}>
      <ErrorText>{error}</ErrorText>
      <Field label="Título">
        <Input
          value={title}
          onChangeText={setTitle}
          placeholder="¿Qué shipeaste?"
          maxLength={140}
        />
      </Field>
      <Field label="Tipo">
        <Segmented
          value={kind}
          onChange={setKind}
          options={ENTRY_KINDS.map((k) => ({ value: k, label: KIND_LABEL[k] }))}
        />
      </Field>
      <Field label="Fecha" hint="AAAA-MM-DD">
        <Input
          value={shippedAt}
          onChangeText={setShippedAt}
          placeholder={todayIso()}
          keyboardType="numbers-and-punctuation"
          autoCorrect={false}
        />
      </Field>
      <Field label="Detalle">
        <Input
          value={body}
          onChangeText={setBody}
          placeholder="Contexto, enlaces, decisiones…"
          multiline
        />
      </Field>
      <Field label="Tags" hint="Separados por coma, máx. 10">
        <Input
          value={tags}
          onChangeText={setTags}
          placeholder="auth, supabase"
          autoCapitalize="none"
        />
      </Field>
      <Button
        title={initial ? "Guardar cambios" : "Registrar ship"}
        onPress={save}
        loading={saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({ form: { gap: spacing.md } });
