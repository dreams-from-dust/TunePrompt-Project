import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { Icon } from "@/components/Icon";

type Step = "email" | "reset";

export default function ForgotPasswordScreen() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isLoading = fetchStatus === "fetching";

  const handleRequestReset = async () => {
    if (!email.trim()) return;
    setError("");
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email.trim(),
      });
      setStep("reset");
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? "Failed to send reset email");
    }
  };

  const handleResetPassword = async () => {
    if (!code.trim() || !newPassword) return;
    setError("");
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code.trim(),
        password: newPassword,
      });
      if (result.status === "complete") {
        Alert.alert("Password Reset", "Your password has been updated. Please sign in.", [
          { text: "Sign In", onPress: () => router.replace("/(auth)/sign-in" as any) },
        ]);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? "Reset failed. Check your code and try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Icon name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>

        <View style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: colors.accent + "20" }]}>
            <Icon name="lock" size={30} color={colors.accent} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {step === "email" ? "Reset Password" : "Enter New Password"}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {step === "email"
              ? "Enter your email and we'll send you a reset code"
              : `We sent a reset code to ${email}`}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {step === "email" ? (
            <>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
                placeholder="your@email.com"
                placeholderTextColor={colors.mutedForeground}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
              />

              {error ? (
                <View style={[styles.errorBox, { backgroundColor: colors.destructive + "20", borderColor: colors.destructive + "40" }]}>
                  <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
                </View>
              ) : null}

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: colors.primary, opacity: pressed || isLoading || !email ? 0.7 : 1 },
                ]}
                onPress={handleRequestReset}
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Send Reset Code</Text>
                )}
              </Pressable>
            </>
          ) : (
            <>
              <View style={{ gap: 16 }}>
                <View>
                  <Text style={[styles.label, { color: colors.mutedForeground }]}>Reset Code</Text>
                  <TextInput
                    style={[styles.input, styles.codeInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
                    placeholder="000000"
                    placeholderTextColor={colors.mutedForeground}
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>

                <View>
                  <Text style={[styles.label, { color: colors.mutedForeground }]}>New Password</Text>
                  <View style={styles.passwordWrap}>
                    <TextInput
                      style={[styles.input, styles.passwordInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
                      placeholder="8+ characters"
                      placeholderTextColor={colors.mutedForeground}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showPassword}
                      textContentType="newPassword"
                    />
                    <Pressable style={styles.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
                      <Icon name={showPassword ? "eye-off" : "eye"} size={18} color={colors.mutedForeground} />
                    </Pressable>
                  </View>
                </View>
              </View>

              {error ? (
                <View style={[styles.errorBox, { backgroundColor: colors.destructive + "20", borderColor: colors.destructive + "40" }]}>
                  <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
                </View>
              ) : null}

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: colors.primary, opacity: pressed || isLoading || !code || !newPassword ? 0.7 : 1 },
                ]}
                onPress={handleResetPassword}
                disabled={isLoading || !code || !newPassword}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Reset Password</Text>
                )}
              </Pressable>

              <Pressable style={styles.resendBtn} onPress={() => handleRequestReset()}>
                <Text style={[styles.resendText, { color: colors.accent }]}>Resend code</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 20 },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  header: { alignItems: "center", marginBottom: 32, gap: 12 },
  iconWrap: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", textAlign: "center" },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  card: { borderRadius: 22, padding: 24, borderWidth: 1, gap: 16 },
  label: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 6 },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  codeInput: { textAlign: "center", fontSize: 22, letterSpacing: 8, fontFamily: "Inter_600SemiBold" },
  passwordWrap: { position: "relative" },
  passwordInput: { paddingRight: 48 },
  eyeBtn: { position: "absolute", right: 14, top: 0, bottom: 0, justifyContent: "center" },
  errorBox: { padding: 12, borderRadius: 10, borderWidth: 1 },
  errorText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  button: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  resendBtn: { alignItems: "center", paddingVertical: 10 },
  resendText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
