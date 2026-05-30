import { useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useHistory } from "@/context/HistoryContext";
import { Icon } from "@/components/Icon";

const WHY_ITEMS = [
  {
    icon: "target" as const,
    color: "#FF6B35",
    title: "Specialized, Not Generic",
    desc: "40 categories fine-tuned for Video and SEO.",
  },
  {
    icon: "layers" as const,
    color: "#C084FC",
    title: "3 Variants Per Request",
    desc: "Choose the best angle for your idea. Different approaches, different results.",
  },
  {
    icon: "book-open" as const,
    color: "#22C55E",
    title: "Teaches You as It Works",
    desc: "Pro tips with every generation so you keep getting better at prompting.",
  },
];

function StatCard({
  value,
  label,
  icon,
  color,
}: {
  value: number;
  label: string;
  icon: any;
  color: string;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        s.statCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={[s.statIcon, { backgroundColor: color + "20" }]}>
        <Icon name={icon} size={16} color={color} />
      </View>
      <Text style={[s.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[s.statLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { history } = useHistory();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  // Consistent Name Extraction
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const rawName = email
    .split("@")[0]
    .replace(/[0-9]/g, "")
    .replace(/([A-Z])/g, " $1")
    .trim();
  const displayName = user?.firstName || rawName.split(" ")[0] || "User";

  const videoCount = history.filter((h) => h.category === "video").length;
  const seoCount = history.filter((h) => h.category === "seo").length;

  const recent = history.slice(0, 3);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingTop: topPad + 16, paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            <Text style={[s.greeting, { color: colors.mutedForeground }]}>
              {greeting},
            </Text>
            <Text style={[s.name, { color: colors.foreground }]}>
              {displayName}
            </Text>
          </View>
          <Pressable
            style={[s.avatar, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/(home)/profile" as any)}
          >
            <Text style={s.avatarText}>
              {(user?.firstName?.[0] ?? displayName[0] ?? "U").toUpperCase()}
            </Text>
          </Pressable>
        </View>
        
        <View
          style={[
            s.heroBanner,
            {
              backgroundColor: colors.primary + "15",
              borderColor: colors.primary + "30",
            },
          ]}
        >
          <View style={s.heroLeft}>
            <Text style={[s.heroTitle, { color: colors.foreground }]}>
              Ready to generate?
            </Text>
            <Text style={[s.heroSub, { color: colors.mutedForeground }]}>
              Turn any rough idea into a perfect AI prompt
            </Text>
          </View>
          <Pressable
            style={[s.heroBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/(home)/generate" as any)}
          >
            <Icon name="zap" size={16} color="#fff" />
            <Text style={s.heroBtnText}>Generate</Text>
          </Pressable>
        </View>

        <View style={s.statsRow}>
          <StatCard
            value={history.length}
            label="Total"
            icon="zap"
            color={colors.primary}
          />
          <StatCard
            value={videoCount}
            label="Video"
            icon="film"
            color="#EF4444"
          />
          <StatCard
            value={seoCount}
            label="SEO"
            icon="trending-up"
            color="#3B82F6"
          />
        </View>

        <Text style={[s.sectionTitle, { color: colors.mutedForeground }]}>
          WHY TUNEPROMPT
        </Text>
        <View style={s.whyList}>
          {WHY_ITEMS.map((item, i) => (
            <View
              key={i}
              style={[
                s.whyCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={[s.whyIcon, { backgroundColor: item.color + "20" }]}>
                <Icon name={item.icon} size={18} color={item.color} />
              </View>
              <View style={s.whyText}>
                <Text style={[s.whyTitle, { color: colors.foreground }]}>
                  {item.title}
                </Text>
                <Text style={[s.whyDesc, { color: colors.mutedForeground }]}>
                  {item.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {recent.length > 0 && (
          <>
            <View style={s.recentHeader}>
              <Text style={[s.sectionTitle, { color: colors.mutedForeground }]}>
                RECENT PROMPTS
              </Text>
              <Pressable onPress={() => router.push("/(home)/history" as any)}>
                <Text style={[s.seeAll, { color: colors.accent }]}>
                  See all
                </Text>
              </Pressable>
            </View>
            <View style={s.recentList}>
              {recent.map((item) => (
                <View
                  key={item.id}
                  style={[
                    s.recentCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={s.recentMeta}>
                    <View
                      style={[
                        s.catBadge,
                        {
                          backgroundColor:
                            item.category === "video"
                              ? "#EF444420"
                              : "#3B82F620",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          s.catText,
                          {
                            color:
                              item.category === "video" ? "#EF4444" : "#3B82F6",
                          },
                        ]}
                      >
                        {item.category === "video" ? "Video" : "SEO"}
                      </Text>
                    </View>
                    <Text
                      style={[s.toolText, { color: colors.mutedForeground }]}
                    >
                      {item.tool}
                    </Text>
                  </View>
                  <Text
                    style={[s.recentInput, { color: colors.foreground }]}
                    numberOfLines={2}
                  >
                    {item.userInput}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { gap: 2 },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  name: { fontSize: 24, fontFamily: "Inter_700Bold" },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  heroBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  heroLeft: { flex: 1, gap: 4 },
  heroTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  heroSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  heroBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  heroBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#fff" },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
  },
  whyList: { gap: 10 },
  whyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  whyIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  whyText: { flex: 1, gap: 4 },
  whyTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  whyDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  recentList: { gap: 10 },
  recentCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 8 },
  recentMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  catText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  toolText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  recentInput: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
});
