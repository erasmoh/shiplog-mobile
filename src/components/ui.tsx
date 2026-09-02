import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type TextInputProps,
} from "react-native";
import { colors, radius, spacing } from "@/lib/theme";

type ButtonProps = PressableProps & {
  title: string;
  variant?: "primary" | "ghost" | "danger";
  loading?: boolean;
};

export function Button({
  title,
  variant = "primary",
  loading,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.btn,
        styles[`btn_${variant}`],
        (pressed || isDisabled) && { opacity: 0.6 },
        typeof style === "function" ? style({ pressed, hovered: false }) : style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.primaryText : colors.text}
        />
      ) : (
        <Text style={[styles.btnText, styles[`btnText_${variant}`]]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <View style={{ gap: spacing.xs }}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      {...props}
      style={[styles.input, props.multiline && styles.inputMultiline, props.style]}
    />
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.value)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text
              style={[styles.segmentText, active && styles.segmentTextActive]}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ErrorText({ children }: { children?: string | null }) {
  if (!children) return null;
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorText}>{children}</Text>
    </View>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function Badge({
  label,
  bg,
  fg,
}: {
  label: string;
  bg: string;
  fg: string;
}) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: fg }]}>{label}</Text>
    </View>
  );
}

export function Centered({ children }: { children: ReactNode }) {
  return <View style={styles.centered}>{children}</View>;
}

export function Muted({ children }: { children: ReactNode }) {
  return <Text style={styles.muted}>{children}</Text>;
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  btn_primary: { backgroundColor: colors.primary },
  btn_ghost: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.border },
  btn_danger: { backgroundColor: colors.dangerBg },
  btnText: { fontSize: 15, fontWeight: "600" },
  btnText_primary: { color: colors.primaryText },
  btnText_ghost: { color: colors.text },
  btnText_danger: { color: colors.danger },
  label: { fontSize: 13, fontWeight: "600", color: colors.text },
  hint: { fontSize: 12, color: colors.muted },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.card,
    minHeight: 44,
  },
  inputMultiline: { minHeight: 96, textAlignVertical: "top" },
  segmented: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  segment: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  segmentActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  segmentText: { fontSize: 13, color: colors.text },
  segmentTextActive: { color: colors.primaryText, fontWeight: "600" },
  errorBox: {
    backgroundColor: colors.dangerBg,
    borderRadius: radius.sm,
    padding: 12,
  },
  errorText: { color: colors.danger, fontSize: 14 },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  badgeText: { fontSize: 11, fontWeight: "600" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  muted: { color: colors.muted, fontSize: 14 },
});
