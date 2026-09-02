import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { Button, ErrorText, Field, Input, Segmented } from "@/components/ui";
import {
  PROJECT_STATUSES,
  STATUS_LABEL,
  type ProjectStatus,
} from "@/lib/constants";
import { slugify } from "@/lib/slug";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/session";
import { colors, spacing } from "@/lib/theme";

export type ProjectInput = {
  name: string;
  description: string | null;
  repo_url: string | null;
  status: ProjectStatus;
  is_public: boolean;
};

type Props = {
  initial?: ProjectInput & { id: string };
  onSaved: (slug: string) => void;
};

function friendly(message: string, code?: string) {
  if (code === "23505") return "Ya tienes un proyecto con ese nombre.";
  return message;
}

export function ProjectForm({ initial, onSaved }: Props) {
  const { session } = useSession();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [repoUrl, setRepoUrl] = useState(initial?.repo_url ?? "");
  const [status, setStatus] = useState<ProjectStatus>(
    initial?.status ?? "active",
  );
  const [isPublic, setIsPublic] = useState(initial?.is_public ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    const trimmed = name.trim();
    if (!trimmed) return setError("El nombre es obligatorio.");
    const slug = slugify(trimmed);
    if (!slug) return setError("El nombre debe incluir letras o números.");
    const repo = repoUrl.trim();
    if (repo && !/^https?:\/\//.test(repo))
      return setError("El enlace al repo debe empezar por http(s)://");
    if (!session) return setError("Sesión expirada.");

    setSaving(true);
    setError(null);
    const values = {
      name: trimmed,
      slug,
      description: description.trim() || null,
      repo_url: repo || null,
      status,
      is_public: isPublic,
    };
    const { error } = initial
      ? await supabase.from("projects").update(values).eq("id", initial.id)
      : await supabase
          .from("projects")
          .insert({ ...values, user_id: session.user.id });
    setSaving(false);
    if (error) return setError(friendly(error.message, error.code));
    onSaved(slug);
  }

  return (
    <View style={styles.form}>
      <ErrorText>{error}</ErrorText>
      <Field label="Nombre" hint={name.trim() ? `/${slugify(name)}` : undefined}>
        <Input value={name} onChangeText={setName} placeholder="Mi proyecto" maxLength={80} />
      </Field>
      <Field label="Descripción">
        <Input
          value={description}
          onChangeText={setDescription}
          placeholder="¿Qué estás construyendo?"
          multiline
        />
      </Field>
      <Field label="Repositorio">
        <Input
          value={repoUrl}
          onChangeText={setRepoUrl}
          placeholder="https://github.com/usuario/repo"
          autoCapitalize="none"
          keyboardType="url"
          autoCorrect={false}
        />
      </Field>
      <Field label="Estado">
        <Segmented
          value={status}
          onChange={setStatus}
          options={PROJECT_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }))}
        />
      </Field>
      {initial ? (
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>Proyecto público</Text>
            <Text style={styles.switchHint}>
              Permite compartir el resumen semanal (Fase 2).
            </Text>
          </View>
          <Switch value={isPublic} onValueChange={setIsPublic} />
        </View>
      ) : null}
      <Button
        title={initial ? "Guardar cambios" : "Crear proyecto"}
        onPress={save}
        loading={saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md },
  switchRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  switchLabel: { fontSize: 13, fontWeight: "600", color: colors.text },
  switchHint: { fontSize: 12, color: colors.muted },
});
