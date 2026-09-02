import * as Linking from "expo-linking";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ErrorText, Field, Input, Muted } from "@/components/ui";
import { useSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { colors, spacing } from "@/lib/theme";

export default function LoginScreen() {
  const { session } = useSession();
  const params = useLocalSearchParams<{ error?: string }>();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(params.error ?? null);

  if (session) return <Redirect href="/" />;

  async function sendLink() {
    const trimmed = email.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: Linking.createURL("/auth/callback") },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>ShipLog</Text>
          <Muted>Tu bitácora de desarrollo, semana a semana.</Muted>
        </View>

        {sent ? (
          <View style={styles.sent}>
            <Text style={styles.sentTitle}>Revisa tu correo</Text>
            <Text style={styles.sentBody}>
              Enviamos un enlace de acceso a {email.trim()}. Ábrelo desde este
              dispositivo para entrar.
            </Text>
            <Button
              title="Usar otro correo"
              variant="ghost"
              onPress={() => setSent(false)}
            />
          </View>
        ) : (
          <View style={styles.form}>
            <ErrorText>{error}</ErrorText>
            <Field label="Correo">
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="tu@correo.com"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                autoCorrect={false}
                returnKeyType="send"
                onSubmitEditing={sendLink}
              />
            </Field>
            <Button
              title="Enviar enlace mágico"
              onPress={sendLink}
              loading={loading}
              disabled={!email.trim()}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, justifyContent: "center", padding: spacing.lg, gap: spacing.xl },
  header: { gap: spacing.xs },
  title: { fontSize: 32, fontWeight: "700", color: colors.text },
  form: { gap: spacing.md },
  sent: { gap: spacing.md, backgroundColor: colors.successBg, padding: spacing.md, borderRadius: 12 },
  sentTitle: { fontSize: 18, fontWeight: "600", color: colors.successText },
  sentBody: { color: colors.successText, fontSize: 14 },
});
