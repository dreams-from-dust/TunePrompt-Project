import { useAuth, useSignUp, useClerk } from "@clerk/expo";
import { Link, Redirect, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
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

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const { setActive } = useClerk();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [code, setCode] = React.useState("");

  const isLoading = fetchStatus === "fetching";
  const needsVerification =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields?.includes("email_address") &&
    signUp.missingFields?.length === 0;

  if (isSignedIn) return <Redirect href="/(home)" />;

  const handleSignUp = async () => {
    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) return;
    if (!error) await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === "complete" && signUp.createdSessionId) {
      await setActive({ session: signUp.createdSessionId });
      router.replace("/(home)" as any);
    }
  };

  if (needsVerification) {
    return (
      <KeyboardAvoidingView
        style={[styles.flex, { backgroundColor: colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={[styles.logoMark, { backgroundColor: colors.primary }]}>
              <Text style={styles.logoText}>T</Text>
            </View>
            <Text style={[styles.appName, { color: colors.foreground }]}>TunePrompt</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.verifyIcon, { backgroundColor: colors.accent + "20" }]}>
              <Icon name="mail" size={28} color={colors.accent} />
            </View>
            <Text style={[styles.title, { color: colors.foreground }]}>Check your email</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              We sent a 6-digit code to{"\n"}{email}
            </Text>

            <View>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Verification Code</Text>
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

            <Pressable
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: colors.primary, opacity: pressed || isLoading || !code ? 0.7 : 1 },
              ]}
              onPress={handleVerify}
              disabled={isLoading || !code}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Verify Email</Text>
              )}
            </Pressable>

            <Pressable style={styles.resendButton} onPress={() => signUp.verifications.sendEmailCode()}>
              <Text style={[styles.resendText, { color: colors.accent }]}>Resend code</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={[styles.logoMark, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoText}>T</Text>
          </View>
          <Text style={[styles.appName, { color: colors.foreground }]}>TunePrompt</Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
            Start generating better AI prompts
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Create account</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Free to use. No credit card required.
          </Text>

          <View style={styles.fields}>
            <View>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Email</Text>
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
              {errors?.fields?.emailAddress && (
                <Text style={[styles.fieldError, { color: colors.destructive }]}>
                  {errors.fields.emailAddress.message}
                </Text>
              )}
            </View>

            <View>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Password</Text>
              <View style={[styles.passwordRow, { backgroundColor: colors.input, borderColor: colors.border }]}>
                <TextInput
                  style={[styles.passwordInput, { color: colors.foreground }]}
                  placeholder="8+ characters"
                  placeholderTextColor={colors.mutedForeground}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  textContentType="newPassword"
                />
                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon
                    name={showPassword ? "eye-off" : "eye"}
                    size={18}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              </View>
              {errors?.fields?.password && (
                <Text style={[styles.fieldError, { color: colors.destructive }]}>
                  {errors.fields.password.message}
                </Text>
              )}
            </View>
          </View>

          {errors?.global && (
            <View style={[styles.errorBox, { backgroundColor: colors.destructive + "20", borderColor: colors.destructive + "40" }]}>
              <Text style={[styles.errorText, { color: colors.destructive }]}>
                {errors.global[0]?.message ?? "An error occurred"}
              </Text>
            </View>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.primary, opacity: pressed || isLoading || !email || !password ? 0.7 : 1 },
            ]}
            onPress={handleSignUp}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/sign-in">
              <Text style={[styles.link, { color: colors.accent }]}>Sign in</Text>
            </Link>
          </View>
        </View>

        <View nativeID="clerk-captcha" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flexGrow: 1, paddingHorizontal: 24, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 32 },
  logoMark: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  logoText: { fontSize: 30, fontFamily: "Inter_700Bold", color: "#fff" },
  appName: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 6 },
  tagline: { fontSize: 14, fontFamily: "Inter_400Regular" },
  card: { borderRadius: 22, padding: 24, borderWidth: 1 },
  verifyIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 6 },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", marginBottom: 24, lineHeight: 22 },
  fields: { gap: 16 },
  label: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 6 },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    height: 50,
    overflow: "hidden",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    height: "100%",
  },
  eyeBtn: {
    paddingHorizontal: 14,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  codeInput: { textAlign: "center", fontSize: 24, letterSpacing: 10, fontFamily: "Inter_600SemiBold" },
  fieldError: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 4 },
  errorBox: { marginTop: 16, padding: 12, borderRadius: 10, borderWidth: 1 },
  errorText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  button: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  buttonText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  resendButton: { alignItems: "center", paddingVertical: 14 },
  resendText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
  footerText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  link: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
