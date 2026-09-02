import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Centered, Muted } from "@/components/ui";
import { supabase } from "@/lib/supabase";

type Params = { code?: string; error_description?: string };

export default function AuthCallback() {
  const { code, error_description } = useLocalSearchParams<Params>();
  const [result, setResult] = useState<"pending" | "ok" | string>("pending");

  useEffect(() => {
    if (error_description || !code) return;
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      setResult(error ? error.message : "ok");
    });
  }, [code, error_description]);

  if (error_description) {
    return (
      <Redirect href={{ pathname: "/login", params: { error: error_description } }} />
    );
  }
  if (!code) {
    return <Redirect href={{ pathname: "/login", params: { error: "Enlace inválido" } }} />;
  }
  if (result === "ok") return <Redirect href="/" />;
  if (result !== "pending") {
    return <Redirect href={{ pathname: "/login", params: { error: result } }} />;
  }
  return (
    <Centered>
      <ActivityIndicator />
      <Muted>Iniciando sesión…</Muted>
    </Centered>
  );
}
