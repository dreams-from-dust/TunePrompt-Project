// app/intro.tsx
import { Icon } from "@/components/Icon";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/expo"; // 1. Added useAuth
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    icon: "zap" as const,
    iconColor: "#FF6B35",
    bgColor: "#FF6B3520",
    title: "Broken Ideas?\nWe Fix That.",
    subtitle:
      "Type your rough idea and TunePrompt transforms it into 3 perfectly engineered AI prompts you can use anywhere.",
    badge: "Prompt Engineering",
  },
  {
    icon: "grid" as const,
    iconColor: "#C084FC",
    bgColor: "#C084FC20",
    title: "40 Specialized\nCategories",
    subtitle:
      "YouTube scripts to Google Ads copy — every category is fine-tuned with professional prompt engineering rules.",
    badge: "Video and SEO/Business",
  },
  {
    icon: "award" as const,
    iconColor: "#22C55E",
    bgColor: "#22C55E20",
    title: "3 Variants Plus\nPro Tips",
    subtitle:
      "Get 3 different prompt angles to choose from, plus expert tips that teach you how to get world-class AI results.",
    badge: "AI Powered by Groq",
  },
];

export default function IntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isSignedIn } = useAuth(); // 2. Get auth state
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(idx);
  };

  const goToSlide = (idx: number) => {
    scrollRef.current?.scrollTo({ x: idx * width, animated: true });
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
      handleStart();
    }
  };

  // 3. Updated logic to handle navigation based on auth status
  const handleStart = () => {
    if (isSignedIn) {
      router.replace("/(home)");
    } else {
      router.replace("/(auth)/sign-in" as any);
    }
  };

  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 },
      ]}
    >
      {!isLast && (
        <Pressable
          style={[styles.skipBtn, { top: insets.top + 16 }]}
          onPress={handleStart}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      )}

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <View style={[styles.iconWrap, { backgroundColor: slide.bgColor }]}>
              <Icon name={slide.icon} size={54} color={slide.iconColor} />
            </View>
            <View style={[styles.badgePill, { backgroundColor: slide.iconColor + "25" }]}>
              <Text style={[styles.badgeText, { color: slide.iconColor }]}>
                {slide.badge}
              </Text>
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <Pressable key={i} onPress={() => goToSlide(i)}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: i === currentIndex ? "#FF6B35" : "#333340",
                  width: i === currentIndex ? 28 : 8,
                },
              ]}
            />
          </Pressable>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [styles.ctaBtn, { opacity: pressed ? 0.85 : 1 }]}
        onPress={handleNext}
      >
        <Text style={styles.ctaText}>{isLast ? "Get Started" : "Next"}</Text>
        <Icon
          name={isLast ? "arrow-right" : "chevron-right"}
          size={20}
          color="#fff"
        />
      </Pressable>

      {!isLast && (
        <Text style={styles.stepText}>
          {currentIndex + 1} / {SLIDES.length}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
    alignItems: "center",
  },
  skipBtn: {
    position: "absolute",
    right: 24,
    zIndex: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#1A1A20",
  },
  skipText: { color: "#6B7280", fontSize: 14, fontFamily: "Inter_500Medium" },
  scrollView: { flex: 1 },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
    gap: 20,
  },
  iconWrap: {
    width: 110,
    height: 110,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  badgePill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  badgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
  title: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    color: "#F5F5F5",
    textAlign: "center",
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 26,
  },
  dots: { flexDirection: "row", gap: 6, marginBottom: 20, alignItems: "center" },
  dot: { height: 8, borderRadius: 4 },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 58,
    width: "88%",
    borderRadius: 18,
    backgroundColor: "#FF6B35",
    marginBottom: 12,
  },
  ctaText: { fontSize: 17, fontFamily: "Inter_600SemiBold", color: "#fff" },
  stepText: { fontSize: 13, fontFamily: "Inter_400Regular", color: "#6B7280" },
});