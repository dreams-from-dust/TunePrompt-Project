// @ts-nocheck
import { useAuth, useUser } from "@clerk/expo";
import { Icon } from "@/components/Icon";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
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
import { useHistory } from "@/context/HistoryContext";

// Dynamic config import
const appConfig = require("../../app.json");

function StatCard({ value, label, icon, color }: { value: number; label: string; icon: any; color: string }) {
  const colors = useColors();
  return (
    <View style={[s.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[s.statIcon, { backgroundColor: color + "20" }]}>
        <Icon name={icon} size={16} color={color} />
      </View>
      <Text style={[s.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[s.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

function ChangeNameModal({ visible, onClose, initialName }: { visible: boolean; onClose: () => void; initialName: string }) {
  const { user } = useUser();
  const colors = useColors();
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const parts = name.split(" ");
      await user?.update({
        firstName: parts[0],
        lastName: parts.slice(1).join(" "),
      });
      onClose();
    } catch (err: any) {
      Alert.alert("Error", "Failed to update name.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Pressable style={s.overlay} onPress={onClose} />
        <View style={[s.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[s.handle, { backgroundColor: colors.border }]} />
          <Text style={[s.sheetTitle, { color: colors.foreground }]}>Edit Name</Text>
          <TextInput
            style={[s.pwRow, { backgroundColor: colors.input, color: colors.foreground, paddingHorizontal: 14 }]}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={colors.mutedForeground}
          />
          <Pressable style={[s.sheetBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.sheetBtnText}>Save</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function ChangePasswordModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { user } = useUser();
  const colors = useColors();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async () => {
    if (!current || !next) return;
    setLoading(true);
    setError("");
    try {
      await user?.updatePassword({ currentPassword: current, newPassword: next });
      Alert.alert("Done", "Your password has been updated.");
      setCurrent("");
      setNext("");
      onClose();
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Pressable style={s.overlay} onPress={onClose} />
        <View style={[s.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[s.handle, { backgroundColor: colors.border }]} />
          <Text style={[s.sheetTitle, { color: colors.foreground }]}>Change Password</Text>
          <View style={{ gap: 14 }}>
            <View>
              <Text style={[s.label, { color: colors.mutedForeground }]}>Current Password</Text>
              <View style={[s.pwRow, { backgroundColor: colors.input, borderColor: colors.border }]}>
                <TextInput
                  style={[s.pwInput, { color: colors.foreground }]}
                  placeholder="Current password"
                  placeholderTextColor={colors.mutedForeground}
                  value={current}
                  onChangeText={setCurrent}
                  secureTextEntry={!showCurrent}
                  textContentType="password"
                />
                <Pressable style={s.eyeBtn} onPress={() => setShowCurrent((v) => !v)}>
                  <Icon name={showCurrent ? "eye-off" : "eye"} size={16} color={colors.mutedForeground} />
                </Pressable>
              </View>
            </View>
            <View>
              <Text style={[s.label, { color: colors.mutedForeground }]}>New Password</Text>
              <View style={[s.pwRow, { backgroundColor: colors.input, borderColor: colors.border }]}>
                <TextInput
                  style={[s.pwInput, { color: colors.foreground }]}
                  placeholder="8+ characters"
                  placeholderTextColor={colors.mutedForeground}
                  value={next}
                  onChangeText={setNext}
                  secureTextEntry={!showNext}
                  textContentType="newPassword"
                />
                <Pressable style={s.eyeBtn} onPress={() => setShowNext((v) => !v)}>
                  <Icon name={showNext ? "eye-off" : "eye"} size={16} color={colors.mutedForeground} />
                </Pressable>
              </View>
            </View>
          </View>
          {error ? (
            <View style={[s.errorBox, { backgroundColor: colors.destructive + "20", borderColor: colors.destructive + "40" }]}>
              <Text style={[s.errorText, { color: colors.destructive }]}>{error}</Text>
            </View>
          ) : null}
          <Pressable
            style={({ pressed }) => [s.sheetBtn, { backgroundColor: colors.primary, opacity: pressed || loading || !current || !next ? 0.7 : 1 }]}
            onPress={handleChange}
            disabled={loading || !current || !next}
          >
            {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.sheetBtnText}>Update Password</Text>}
          </Pressable>
          <Pressable style={s.cancelBtn} onPress={onClose}>
            <Text style={[s.cancelText, { color: colors.mutedForeground }]}>Cancel</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { history, clearHistory } = useHistory();
  const [showChangePw, setShowChangePw] = useState(false);
  const [showChangeName, setShowChangeName] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const videoCount = history.filter((h) => h.category === "video").length;
  const seoCount = history.filter((h) => h.category === "seo").length;

  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const rawName = email.split('@')[0].replace(/[0-9]/g, "").replace(/([A-Z])/g, " $1").trim();
  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`.trim()
    : rawName || "User";

  const avatarLetter = (user?.firstName?.[0] ?? displayName[0] ?? "U").toUpperCase();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await signOut();
          router.replace("/(auth)/sign-in" as any);
        },
      },
    ]);
  };

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[s.content, { paddingTop: topPad + 16, paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[s.heading, { color: colors.foreground }]}>Profile</Text>

        <Pressable 
          style={[s.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setShowChangeName(true)}
        >
          <View style={[s.avatar, { backgroundColor: colors.primary }]}>
            <Text style={s.avatarText}>{avatarLetter}</Text>
          </View>
          <View style={s.profileInfo}>
            <Text style={[s.name, { color: colors.foreground }]}>{displayName}</Text>
            <Text style={[s.emailText, { color: colors.mutedForeground }]}>{email}</Text>
          </View>
        </Pressable>

        <View style={s.statsRow}>
          <StatCard value={history.length} label="Total" icon="zap" color={colors.primary} />
          <StatCard value={videoCount} label="Video" icon="film" color="#EF4444" />
          <StatCard value={seoCount} label="SEO" icon="trending-up" color="#3B82F6" />
        </View>

        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.mutedForeground }]}>ACCOUNT</Text>
          <View style={[s.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Pressable
              style={({ pressed }) => [s.menuItem, { borderBottomColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
              onPress={() => setShowChangePw(true)}
            >
              <View style={s.menuLeft}>
                <View style={[s.menuIcon, { backgroundColor: colors.accent + "20" }]}>
                  <Icon name="lock" size={14} color={colors.accent} />
                </View>
                <Text style={[s.menuLabel, { color: colors.foreground }]}>Change Password</Text>
              </View>
              <Icon name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [s.menuItem, { borderBottomWidth: 0, opacity: pressed ? 0.7 : 1 }]}
              onPress={() => {
                Alert.alert("Clear History", "Remove all saved prompts?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Clear", style: "destructive", onPress: clearHistory },
                ]);
              }}
            >
              <View style={s.menuLeft}>
                <View style={[s.menuIcon, { backgroundColor: colors.destructive + "20" }]}>
                  <Icon name="trash-2" size={14} color={colors.destructive} />
                </View>
                <Text style={[s.menuLabel, { color: colors.foreground }]}>Clear History</Text>
              </View>
              <Icon name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          </View>
        </View>

        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.mutedForeground }]}>ABOUT</Text>
          <View style={[s.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[s.menuItem, { borderBottomColor: colors.border }]}>
              <View style={s.menuLeft}>
                <View style={[s.menuIcon, { backgroundColor: colors.primary + "20" }]}>
                  <Icon name="info" size={14} color={colors.primary} />
                </View>
                <Text style={[s.menuLabel, { color: colors.foreground }]}>App Version</Text>
              </View>
              <Text style={[s.menuValue, { color: colors.mutedForeground }]}>{appConfig.expo.version}</Text>
            </View>
            <View style={[s.menuItem, { borderBottomWidth: 0 }]}>
              <View style={s.menuLeft}>
                <View style={[s.menuIcon, { backgroundColor: colors.accent + "20" }]}>
                  <Icon name="cpu" size={14} color={colors.accent} />
                </View>
                <Text style={[s.menuLabel, { color: colors.foreground }]}>AI Engine</Text>
              </View>
              <Text style={[s.menuValue, { color: colors.mutedForeground }]}>Groq / Llama 3.3</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            s.signOutBtn,
            { backgroundColor: colors.destructive + "15", borderColor: colors.destructive + "40", opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={handleSignOut}
        >
          <Icon name="log-out" size={16} color={colors.destructive} />
          <Text style={[s.signOutText, { color: colors.destructive }]}>Sign Out</Text>
        </Pressable>
      </ScrollView>

      <ChangeNameModal visible={showChangeName} onClose={() => setShowChangeName(false)} initialName={displayName} />
      <ChangePasswordModal visible={showChangePw} onClose={() => setShowChangePw(false)} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  heading: { fontSize: 26, fontFamily: "Inter_700Bold" },
  profileCard: { borderRadius: 16, padding: 16, borderWidth: 1, flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: { width: 58, height: 58, borderRadius: 29, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff" },
  profileInfo: { flex: 1, gap: 3 },
  name: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  emailText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  statsRow: { flexDirection: "row", gap: 8 },
  statCard: { flex: 1, borderRadius: 14, padding: 12, borderWidth: 1, alignItems: "center", gap: 6 },
  statIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center" },
  section: { gap: 8 },
  sectionTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
  menuCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, borderBottomWidth: 1 },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  menuLabel: { fontSize: 15, fontFamily: "Inter_400Regular" },
  menuValue: { fontSize: 13, fontFamily: "Inter_400Regular" },
  signOutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 52, borderRadius: 14, borderWidth: 1 },
  signOutText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, padding: 24, gap: 16 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 8 },
  sheetTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  label: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 6 },
  pwRow: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1, height: 48, overflow: "hidden" },
  pwInput: { flex: 1, paddingHorizontal: 14, fontSize: 15, fontFamily: "Inter_400Regular", height: "100%" },
  eyeBtn: { paddingHorizontal: 14, height: "100%", justifyContent: "center", alignItems: "center" },
  errorBox: { padding: 12, borderRadius: 10, borderWidth: 1 },
  errorText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  sheetBtn: { height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  sheetBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  cancelBtn: { alignItems: "center", paddingVertical: 10 },
  cancelText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
