import { useUser, useAuth } from "@clerk/expo";

import { Icon } from "@/components/Icon";

import * as Clipboard from "expo-clipboard";

import * as Haptics from "expo-haptics";

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

import Markdown from "react-native-markdown-display";

import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

import { useHistory } from "@/context/HistoryContext";

import type { PromptCategory } from "@/context/HistoryContext";

interface CategoryDef {
  id: string;

  label: string;

  icon: string;

  placeholder: string;
}

const VIDEO_CATS: CategoryDef[] = [
  {
    id: "youtube_script",
    label: "YouTube Script",
    icon: "film",
    placeholder: "e.g. A beginner tutorial on video editing in CapCut",
  },

  {
    id: "video_hook",
    label: "Hook and Intro",
    icon: "anchor",
    placeholder: "e.g. Hook for a video about making money online in 2025",
  },

  {
    id: "thumbnail",
    label: "Thumbnail Design",
    icon: "image",
    placeholder: "e.g. Viral thumbnail for a productivity hack video",
  },

  {
    id: "video_title",
    label: "Video Titles",
    icon: "type",
    placeholder: "e.g. Python tutorial for absolute beginners",
  },

  {
    id: "video_description",
    label: "Video Description",
    icon: "align-left",
    placeholder: "e.g. A video teaching how to edit on mobile for free",
  },

  {
    id: "cta",
    label: "Call-to-Action",
    icon: "target",
    placeholder: "e.g. Subscribe CTA for a fitness channel",
  },

  {
    id: "reels_tiktok",
    label: "Reels / TikTok",
    icon: "smartphone",
    placeholder: "e.g. Quick tip reel about saving money as a student",
  },

  {
    id: "documentary",
    label: "Documentary",
    icon: "camera",
    placeholder: "e.g. Mini-doc about street food culture",
  },

  {
    id: "tutorial",
    label: "Tutorial Script",
    icon: "book-open",
    placeholder: "e.g. How to make a website using WordPress for free",
  },

  {
    id: "product_review",
    label: "Product Review",
    icon: "star",
    placeholder: "e.g. Honest review of the iPhone 16 Pro",
  },

  {
    id: "vlog",
    label: "Vlog Story Arc",
    icon: "video",
    placeholder: "e.g. Day in the life of a freelance designer",
  },

  {
    id: "podcast_notes",
    label: "Podcast Notes",
    icon: "mic",
    placeholder: "e.g. Episode about AI tools changing creative work",
  },

  {
    id: "youtube_shorts",
    label: "YouTube Shorts",
    icon: "zap",
    placeholder: "e.g. 3 habits that changed my life",
  },

  {
    id: "video_ad",
    label: "Video Ad Script",
    icon: "play-circle",
    placeholder: "e.g. 30-second ad for an online coding bootcamp",
  },

  {
    id: "explainer",
    label: "Explainer Video",
    icon: "help-circle",
    placeholder: "e.g. Explain how blockchain works for non-techies",
  },

  {
    id: "interview",
    label: "Interview Questions",
    icon: "users",
    placeholder: "e.g. Interview a successful Shopify dropshipper",
  },

  {
    id: "channel_trailer",
    label: "Channel Trailer",
    icon: "tv",
    placeholder: "e.g. Channel about travel photography across Asia",
  },

  {
    id: "outro",
    label: "Outro Script",
    icon: "log-out",
    placeholder: "e.g. Outro for a motivational YouTube channel",
  },

  {
    id: "commentary",
    label: "Commentary Script",
    icon: "message-circle",
    placeholder: "e.g. Commentary on a trending tech news story",
  },

  {
    id: "channel_strategy",
    label: "Channel Strategy",
    icon: "trending-up",
    placeholder: "e.g. Grow a cooking channel from 0 to 10k subs",
  },
];

const SEO_CATS: CategoryDef[] = [
  {
    id: "blog_outline",
    label: "Blog Post Outline",
    icon: "file-text",
    placeholder: "e.g. Best AI tools for freelancers in 2025",
  },

  {
    id: "meta_tags",
    label: "Meta Tags",
    icon: "tag",
    placeholder: "e.g. Page selling affordable laptops for students",
  },

  {
    id: "keywords",
    label: "Keyword Research",
    icon: "search",
    placeholder: "e.g. My website sells handmade leather bags online",
  },

  {
    id: "content_brief",
    label: "Content Brief",
    icon: "clipboard",
    placeholder: "e.g. Blog post on how to start dropshipping",
  },

  {
    id: "homepage_copy",
    label: "Homepage Copy",
    icon: "home",
    placeholder: "e.g. SaaS tool that automates social media posting",
  },

  {
    id: "social_captions",
    label: "Social Captions",
    icon: "share-2",
    placeholder: "e.g. Instagram post for a new product launch",
  },

  {
    id: "email_newsletter",
    label: "Email Newsletter",
    icon: "mail",
    placeholder: "e.g. Weekly newsletter for a digital marketing agency",
  },

  {
    id: "press_release",
    label: "Press Release",
    icon: "radio",
    placeholder: "e.g. Launch of a new fintech app",
  },

  {
    id: "product_desc",
    label: "Product Description",
    icon: "package",
    placeholder: "e.g. Premium wireless earbuds with 40hr battery life",
  },

  {
    id: "landing_page",
    label: "Landing Page",
    icon: "layout",
    placeholder: "e.g. Landing page for an online learning course",
  },

  {
    id: "faq",
    label: "FAQ Section",
    icon: "help-circle",
    placeholder: "e.g. FAQ for a freelance web design service",
  },

  {
    id: "linkedin_article",
    label: "LinkedIn Article",
    icon: "briefcase",
    placeholder: "e.g. Why developers are dominating Upwork",
  },

  {
    id: "business_proposal",
    label: "Business Proposal",
    icon: "file-text",
    placeholder: "e.g. Proposal for a social media management service",
  },

  {
    id: "case_study",
    label: "Case Study",
    icon: "bar-chart-2",
    placeholder: "e.g. How we grew a client's traffic by 300% in 6 months",
  },

  {
    id: "google_ads",
    label: "Google Ads Copy",
    icon: "mouse-pointer",
    placeholder: "e.g. Google ad for a dentist clinic",
  },

  {
    id: "brand_story",
    label: "Brand Story",
    icon: "heart",
    placeholder: "e.g. A clothing brand inspired by Mughal heritage",
  },

  {
    id: "cold_email",
    label: "Cold Email",
    icon: "send",
    placeholder: "e.g. Outreach email to e-commerce store owners",
  },

  {
    id: "seo_audit",
    label: "SEO Audit",
    icon: "check-circle",
    placeholder: "e.g. SEO audit for a blog about personal finance",
  },

  {
    id: "youtube_seo",
    label: "YouTube SEO",
    icon: "trending-up",
    placeholder: "e.g. SEO strategy for a cooking channel",
  },

  {
    id: "competitor_analysis",
    label: "Competitor Analysis",
    icon: "activity",
    placeholder: "e.g. Analysis of top 3 competitors in online fitness niche",
  },
];

export default function GenerateScreen() {
  const { user } = useUser();

  const { getToken } = useAuth();

  const colors = useColors();

  const { addToHistory } = useHistory();

  const [category, setCategory] = useState<PromptCategory>("video");

  const [modalCat, setModalCat] = useState<CategoryDef | null>(null);

  const [modalVisible, setModalVisible] = useState(false);

  const [userInput, setUserInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [prompts, setPrompts] = useState<string[]>([]);

  const [tips, setTips] = useState<string[]>([]);

  const [activeVariant, setActiveVariant] = useState(0);

  const [copied, setCopied] = useState(false);

  const cats = category === "video" ? VIDEO_CATS : SEO_CATS;

  const handleCategoryToggle = (cat: PromptCategory) => {
    setCategory(cat);
  };

  const openModal = (cat: CategoryDef) => {
    setModalCat(cat);

    setUserInput("");

    setPrompts([]);

    setTips([]);

    setActiveVariant(0);

    setCopied(false);

    setModalVisible(true);
  };

  const handleReset = () => {
    setUserInput("");

    setPrompts([]);

    setTips([]);

    setActiveVariant(0);

    setCopied(false);
  };

  const closeModal = () => {
    setModalVisible(false);

    setModalCat(null);

    handleReset();
  };

  const handleGenerate = async () => {
    if (!userInput.trim() || !modalCat) return;

    setIsLoading(true);

    try {
      const token = await getToken();
      // The variable contains the full URL (e.g., https://...replit.app)
      const baseUrl = process.env.EXPO_PUBLIC_API_URL;

      if (!baseUrl) {
        throw new Error("API URL is not configured.");
      }

      // Fix: Use the base URL directly without adding 'https://' again
      const url = `${baseUrl}/api/generate`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          tool: modalCat.id,
          userInput: userInput.trim(),
        }),
      });

      const responseText = await res.text();
      if (!res.ok) {
        throw new Error(`Server error ${res.status}: ${responseText}`);
      }

      const result = JSON.parse(responseText);

      setPrompts(result.prompts ?? []);
      setTips(result.tips ?? []);

      await addToHistory({
        category,
        tool: modalCat.id,
        toolId: modalCat.id,
        userInput: userInput.trim(),
        prompts: result.prompts ?? [],
        selectedPrompt: (result.prompts ?? [])[0] ?? "",
        tips: result.tips ?? [],
      });

    } catch (err: any) {
      console.error("DEBUG: Fetch Error:", err);
      // This will now show you the actual error (e.g., 404, 500, or Network Request Failed)
      Alert.alert("Error", err.message || "Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!prompts[activeVariant]) return;

    await Clipboard.setStringAsync(prompts[activeVariant]);

    setCopied(true);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setTimeout(() => setCopied(false), 2000);
  };

  const mdStyles = {
    body: {
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      fontSize: 14,
      lineHeight: 22,
    } as any,

    heading2: {
      color: colors.primary,
      fontFamily: "Inter_700Bold",
      fontSize: 15,
      marginBottom: 6,
      marginTop: 4,
    } as any,

    heading3: {
      color: colors.accent,
      fontFamily: "Inter_600SemiBold",
      fontSize: 14,
      marginBottom: 4,
    } as any,

    strong: {
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    } as any,

    paragraph: { marginBottom: 6 } as any,

    bullet_list_icon: { color: colors.primary } as any,
  };

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingTop: Platform.OS === "ios" ? 80 : 40, paddingBottom: 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.pageHeader}>
          <Text style={[s.heading, { color: colors.foreground }]}>
            Generate Prompt
          </Text>

          <Text style={[s.subheading, { color: colors.mutedForeground }]}>
            Select a category to get started
          </Text>
        </View>

        <View
          style={[
            s.toggleRow,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {(["video", "seo"] as PromptCategory[]).map((cat) => (
            <Pressable
              key={cat}
              style={[
                s.toggleBtn,
                category === cat && { backgroundColor: colors.primary },
              ]}
              onPress={() => handleCategoryToggle(cat)}
            >
              <Icon
                name={cat === "video" ? "film" : "trending-up"}
                size={14}
                color={category === cat ? "#fff" : colors.mutedForeground}
              />

              <Text
                style={[
                  s.toggleText,
                  { color: category === cat ? "#fff" : colors.mutedForeground },
                ]}
              >
                {cat === "video" ? "Video" : "SEO / Business"}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[s.sectionLabel, { color: colors.mutedForeground }]}>
          {cats.length} CATEGORIES - TAP TO SELECT
        </Text>

        <View style={s.catGrid}>
          {cats.map((cat) => (
            <Pressable
              key={cat.id}
              style={({ pressed }) => [
                s.catCard,

                {
                  backgroundColor: pressed
                    ? colors.primary + "20"
                    : colors.card,

                  borderColor: pressed ? colors.primary : colors.border,

                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              onPress={() => openModal(cat)}
            >
              <View
                style={[
                  s.catIconBox,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Icon name={cat.icon as any} size={16} color={colors.primary} />
              </View>

              <Text
                style={[s.catLabel, { color: colors.foreground }]}
                numberOfLines={2}
              >
                {cat.label}
              </Text>

              <Icon
                name="chevron-right"
                size={12}
                color={colors.mutedForeground}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <SafeAreaView
          style={[s.modalContainer, { backgroundColor: colors.background }]}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
          >
            <View style={[s.modalHeader, { borderBottomColor: colors.border }]}>
              <Pressable style={s.modalHeaderBtn} onPress={closeModal}>
                <Icon name="x" size={22} color={colors.foreground} />
              </Pressable>

              <View style={s.modalHeaderCenter}>
                <Icon
                  name={modalCat?.icon as any}
                  size={16}
                  color={colors.primary}
                />

                <Text
                  style={[s.modalTitle, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {modalCat?.label}
                </Text>
              </View>

              <Pressable
                style={s.modalHeaderBtn}
                onPress={handleReset}
                disabled={!userInput && prompts.length === 0}
              >
                <Icon
                  name="refresh-cw"
                  size={18}
                  color={
                    userInput || prompts.length > 0
                      ? colors.primary
                      : colors.mutedForeground
                  }
                />
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={s.modalScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={[s.inputLabel, { color: colors.mutedForeground }]}>
                Describe your rough idea
              </Text>

              <TextInput
                style={[
                  s.textArea,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.foreground,
                  },
                ]}
                placeholder={modalCat?.placeholder ?? "Describe your idea..."}
                placeholderTextColor={colors.mutedForeground}
                value={userInput}
                onChangeText={setUserInput}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <Pressable
                style={({ pressed }) => [
                  s.genBtn,

                  {
                    backgroundColor: colors.primary,

                    opacity:
                      pressed || isLoading || !userInput.trim() ? 0.7 : 1,
                  },
                ]}
                onPress={handleGenerate}
                disabled={isLoading || !userInput.trim()}
              >
                {isLoading ? (
                  <>
                    <ActivityIndicator color="#fff" size="small" />

                    <Text style={s.genBtnText}>Generating 3 prompts...</Text>
                  </>
                ) : (
                  <>
                    <Icon name="zap" size={16} color="#fff" />

                    <Text style={s.genBtnText}>Generate 3 Prompts</Text>
                  </>
                )}
              </Pressable>

              {prompts.length > 0 && (
                <View style={s.resultsSection}>
                  <View style={s.variantTabs}>
                    {prompts.map((_, i) => (
                      <Pressable
                        key={i}
                        style={[
                          s.variantTab,

                          {
                            backgroundColor:
                              activeVariant === i
                                ? colors.primary
                                : colors.card,

                            borderColor:
                              activeVariant === i
                                ? colors.primary
                                : colors.border,
                          },
                        ]}
                        onPress={() => setActiveVariant(i)}
                      >
                        <Text
                          style={[
                            s.variantTabText,

                            {
                              color:
                                activeVariant === i
                                  ? "#fff"
                                  : colors.mutedForeground,
                            },
                          ]}
                        >
                          Variant {i + 1}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <View
                    style={[
                      s.promptCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.primary + "50",
                      },
                    ]}
                  >
                    <View
                      style={[
                        s.promptHeader,
                        { borderBottomColor: colors.border },
                      ]}
                    >
                      <View
                        style={[
                          s.promptDot,
                          { backgroundColor: colors.success },
                        ]}
                      />

                      <Text
                        style={[
                          s.promptHeaderText,
                          { color: colors.foreground },
                        ]}
                      >
                        Prompt Ready
                      </Text>

                      <View
                        style={[
                          s.savedBadge,
                          { backgroundColor: colors.success + "20" },
                        ]}
                      >
                        <Icon name="check" size={10} color={colors.success} />

                        <Text
                          style={[s.savedBadgeText, { color: colors.success }]}
                        >
                          Auto-saved
                        </Text>
                      </View>
                    </View>

                    <View style={{ padding: 14 }}>
                      <Markdown style={mdStyles}>
                        {prompts[activeVariant] ?? ""}
                      </Markdown>
                    </View>

                    <View
                      style={[s.actionRow, { borderTopColor: colors.border }]}
                    >
                      <Pressable
                        style={({ pressed }) => [
                          s.copyBtn,

                          {
                            backgroundColor: copied
                              ? colors.success + "20"
                              : colors.primary + "20",

                            borderColor: copied
                              ? colors.success
                              : colors.primary,

                            opacity: pressed ? 0.7 : 1,
                          },
                        ]}
                        onPress={handleCopy}
                      >
                        <Icon
                          name={copied ? "check" : "copy"}
                          size={14}
                          color={copied ? colors.success : colors.primary}
                        />

                        <Text
                          style={[
                            s.copyBtnText,
                            { color: copied ? colors.success : colors.primary },
                          ]}
                        >
                          {copied ? "Copied!" : "Copy Prompt"}
                        </Text>
                      </Pressable>

                      <Pressable
                        style={({ pressed }) => [
                          s.iconBtn,

                          {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            opacity: pressed ? 0.7 : 1,
                          },
                        ]}
                        onPress={handleGenerate}
                      >
                        <Icon
                          name="refresh-cw"
                          size={15}
                          color={colors.mutedForeground}
                        />
                      </Pressable>
                    </View>
                  </View>

                  {tips.length > 0 && (
                    <View
                      style={[
                        s.tipsCard,
                        {
                          backgroundColor: colors.accent + "10",
                          borderColor: colors.accent + "30",
                        },
                      ]}
                    >
                      <View style={s.tipsHeader}>
                        <Icon name="star" size={15} color={colors.accent} />

                        <Text style={[s.tipsTitle, { color: colors.accent }]}>
                          Pro Tips
                        </Text>
                      </View>

                      {tips.map((tip, i) => (
                        <View key={i} style={s.tipRow}>
                          <View
                            style={[
                              s.tipDot,
                              { backgroundColor: colors.accent },
                            ]}
                          />

                          <Text
                            style={[s.tipText, { color: colors.foreground }]}
                          >
                            {tip.replace(/\*/g, "")}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <Pressable
                    style={[s.newPromptBtn, { borderColor: colors.border }]}
                    onPress={handleReset}
                  >
                    <Icon
                      name="refresh-cw"
                      size={14}
                      color={colors.mutedForeground}
                    />

                    <Text
                      style={[
                        s.newPromptText,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      Start over with a new idea
                    </Text>
                  </Pressable>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },

  scroll: { paddingHorizontal: 16, gap: 14 },

  pageHeader: { gap: 4 },

  heading: { fontSize: 26, fontFamily: "Inter_700Bold" },

  subheading: { fontSize: 14, fontFamily: "Inter_400Regular" },

  toggleRow: {
    flexDirection: "row",

    borderRadius: 14,

    borderWidth: 1,

    padding: 4,

    gap: 4,
  },

  toggleBtn: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 6,

    paddingVertical: 10,

    borderRadius: 10,
  },

  toggleText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },

  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
  },

  catGrid: { gap: 8 },

  catCard: {
    flexDirection: "row",

    alignItems: "center",

    gap: 12,

    borderRadius: 14,

    borderWidth: 1,

    padding: 14,
  },

  catIconBox: {
    width: 36,

    height: 36,

    borderRadius: 10,

    alignItems: "center",

    justifyContent: "center",
  },

  catLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },

  modalContainer: { flex: 1 },

  modalHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 16,

    paddingVertical: 14,

    borderBottomWidth: 1,
  },

  modalHeaderBtn: {
    width: 40,

    height: 40,

    alignItems: "center",

    justifyContent: "center",
  },

  modalHeaderCenter: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 8,
  },

  modalTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },

  modalScroll: { padding: 16, gap: 14, paddingBottom: 60 },

  inputLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },

  textArea: {
    borderRadius: 14,

    borderWidth: 1,

    padding: 14,

    fontSize: 15,

    fontFamily: "Inter_400Regular",

    minHeight: 110,

    lineHeight: 22,
  },

  genBtn: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 8,

    height: 54,

    borderRadius: 14,
  },

  genBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },

  resultsSection: { gap: 12 },

  variantTabs: { flexDirection: "row", gap: 8 },

  variantTab: {
    flex: 1,

    alignItems: "center",

    paddingVertical: 10,

    borderRadius: 10,

    borderWidth: 1,
  },

  variantTabText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  promptCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },

  promptHeader: {
    flexDirection: "row",

    alignItems: "center",

    gap: 8,

    padding: 14,

    borderBottomWidth: 1,
  },

  promptDot: { width: 8, height: 8, borderRadius: 4 },

  promptHeaderText: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold" },

  savedBadge: {
    flexDirection: "row",

    alignItems: "center",

    gap: 4,

    paddingHorizontal: 8,

    paddingVertical: 3,

    borderRadius: 6,
  },

  savedBadgeText: { fontSize: 11, fontFamily: "Inter_500Medium" },

  actionRow: {
    flexDirection: "row",

    gap: 8,

    padding: 14,

    borderTopWidth: 1,
  },

  copyBtn: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 6,

    height: 42,

    borderRadius: 10,

    borderWidth: 1,
  },

  copyBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },

  iconBtn: {
    width: 42,

    height: 42,

    alignItems: "center",

    justifyContent: "center",

    borderRadius: 10,

    borderWidth: 1,
  },

  tipsCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10 },

  tipsHeader: { flexDirection: "row", alignItems: "center", gap: 8 },

  tipsTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },

  tipRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },

  tipDot: { width: 6, height: 6, borderRadius: 3, marginTop: 8, flexShrink: 0 },

  tipText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },

  newPromptBtn: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 8,

    height: 46,

    borderRadius: 12,

    borderWidth: 1,
  },

  newPromptText: { fontSize: 14, fontFamily: "Inter_500Medium" },
});
