// @ts-nocheck
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Share,
  StatusBar,
} from "react-native";
import { Icon } from "@/components/Icon";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import Markdown from "react-native-markdown-display";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useHistory, type HistoryItem } from "@/context/HistoryContext";

function HistoryCard({ 
  item, 
  onDelete 
}: { 
  item: HistoryItem; 
  onDelete: (id: string) => void; 
}) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const [activeVariant, setActiveVariant] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(item.prompts[activeVariant]);
    setCopied(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    await Share.share({ message: item.prompts[activeVariant] });
  };

  const confirmDelete = () => {
    Alert.alert("Delete Prompt", "Are you sure you want to delete this prompt?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete(item.id) }
    ]);
  };

  const catColor = item.category === "video" ? "#EF4444" : "#3B82F6";
  const catLabel = item.category === "video" ? "Video" : "SEO";

  return (
    <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Pressable onPress={() => setExpanded(!expanded)}>
        <View style={s.cardHeader}>
          <View style={s.cardMeta}>
            <View style={[s.catBadge, { backgroundColor: catColor + "20" }]}>
              <Text style={[s.catText, { color: catColor }]}>{catLabel}</Text>
            </View>
            <Text style={[s.toolText, { color: colors.mutedForeground }]}>{item.tool}</Text>
          </View>
          <Text style={[s.dateText, { color: colors.mutedForeground }]}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Text style={[s.inputText, { color: colors.mutedForeground }]}>"{item.userInput}"</Text>
      </Pressable>

      {expanded ? (
        <View style={s.expandedContent}>
          <View style={s.tabRow}>
            {item.prompts.map((_, index) => (
              <Pressable 
                key={index} 
                style={[s.tab, activeVariant === index && { backgroundColor: colors.primary }]}
                onPress={() => setActiveVariant(index)}
              >
                <Text style={{ color: activeVariant === index ? "#FFF" : colors.mutedForeground }}>
                  Var {index + 1}
                </Text>
              </Pressable>
            ))}
          </View>

          <Markdown style={{ body: { color: colors.foreground } }}>
            {item.prompts[activeVariant]}
          </Markdown>

          <View style={s.expandedActions}>
            <Pressable style={[s.actionBtn, { flex: 1 }]} onPress={handleCopy}>
              <Icon name={copied ? "check" : "copy"} size={14} color={colors.primary} />
              <Text style={{ color: colors.primary, marginLeft: 8 }}>{copied ? "Copied!" : "Copy"}</Text>
            </Pressable>
            <Pressable style={[s.actionBtn, { flex: 1 }]} onPress={handleShare}>
              <Icon name="share-2" size={14} color={colors.foreground} />
              <Text style={{ color: colors.foreground, marginLeft: 8 }}>Share</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={s.bottomActions}>
          <Pressable style={s.iconBtn} onPress={confirmDelete}>
            <Icon name="trash-2" size={18} color={colors.destructive} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { history, removeFromHistory, clearHistory } = useHistory();

  const confirmClearAll = () => {
    Alert.alert("Clear All", "Delete entire history?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear All", style: "destructive", onPress: clearHistory }
    ]);
  };

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <View style={[s.header, { paddingTop: (Platform.OS === "web" ? 67 : insets.top) + 16 }]}>
        <Text style={[s.heading, { color: colors.foreground }]}>History</Text>
        {history.length > 0 && (
            <Pressable onPress={confirmClearAll} style={s.clearBtn}>
                <Text style={{ color: colors.destructive, fontWeight: "600" }}>Clear All</Text>
            </Pressable>
        )}
      </View>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HistoryCard item={item} onDelete={removeFromHistory} />
        )}
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 100 }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  heading: { fontSize: 28, fontWeight: "800", fontFamily: "Inter_700Bold" }, // Changed to Inter_700Bold
  clearBtn: { padding: 8 },
  card: { borderRadius: 20, padding: 20, borderWidth: 1, gap: 8 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 10 },
  catBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  catText: { fontSize: 12, fontWeight: "700", fontFamily: "Inter_700Bold" },
  toolText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  dateText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  inputText: { fontSize: 14, fontStyle: "italic", opacity: 0.7, fontFamily: "Inter_400Regular" },
  expandedContent: { marginTop: 12, padding: 10, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.03)" },
  tabRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  tab: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: "rgba(128,128,128,0.1)" },
  tabText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  expandedActions: { flexDirection: "row", gap: 10, marginTop: 10 },
  actionBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: "rgba(128,128,128,0.2)" },
  actionBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginLeft: 8 },
  bottomActions: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: "rgba(128,128,128,0.1)" },
  iconBtn: { width: "100%", height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(128,128,128,0.05)" }
});
