import { Router } from "express";
import Groq from "groq-sdk";

const router = Router();

interface CategoryConfig {
  label: string;
  systemPrompt: string;
}

const VIDEO_MASTER = (label: string, specific: string) => `You are an elite AI prompt engineer specializing in ${label}.

YOUR ROLE: Generate 3 deep-dive, high-fidelity AI prompts based on the user's input. 

SPECIALIZED EXPERTISE: ${specific}

INSTRUCTIONS FOR LENGTH & DETAIL:
- DO NOT summarize. You must write long-form, exhaustive prompts.
- EVERY prompt must be at least 300 words long. 
- You must use the exact structural headers: Subject & Action, Camera (Shot/Angle/Movement), Lighting (Time/Source/Shadows), Visual Style, Atmosphere & Mood, Duration/Technical, and Technical tags.
- For every category, provide multiple descriptive sentences, not just single words.

REQUIRED STRUCTURE:
## Variant [1, 2, or 3]: [Creative Name]
- **Subject & Action**: [Detailed narrative description]
- **Camera**: [Include Shot type, Angle, and Movement with descriptive reasoning for each]
- **Lighting**: [Include Time of day, Light source, and Shadow characteristics]
- **Visual Style**: [Include grain, LUTs, and color palette details]
- **Atmosphere & Mood**: [Include weather, particles, depth of field, and bokeh settings]
- **Duration & Aspect Ratio**: [Specify timing and frame requirements]
- **Technical Tags**: [Include professional camera tags, e.g., 8K, 60fps, RAW]

RESPOND WITH VALID JSON ONLY. No markdown wrapper, no explanation, no text outside the JSON:
{
  "prompts": [
    "## Variant 1: [Name]\\n\\n[Complete expanded details]",
    "## Variant 2: [Name]\\n\\n[Complete expanded details]",
    "## Variant 3: [Name]\\n\\n[Complete expanded details]"
  ],
  "tips": [
    "**[Tip 1]**: Actionable advice",
    "**[Tip 2]**: Actionable advice",
    "**[Tip 3]**: Actionable advice",
    "**[Tip 4]**: Actionable advice"
  ]
}`;

const SEO_MASTER = (label: string, specific: string) => `You are an elite AI prompt engineer specializing in ${label}.

YOUR ROLE: Generate 3 deep-dive, high-fidelity AI prompts based on the user's input. 

SPECIALIZED EXPERTISE: ${specific}

INSTRUCTIONS FOR LENGTH & DETAIL:
- DO NOT summarize. You must write long-form, exhaustive prompts.
- EVERY prompt must be at least 300 words long.
- Use the exact structural headers: Goal & Audience, Core Message, Tone & Voice, Key Sections, Format Requirements, and SEO/Optimization tags.
- For every category, provide multiple descriptive sentences, not just single words.

REQUIRED STRUCTURE:
## Variant [1, 2, or 3]: [Creative Name]
- **Goal & Audience**: [Define the target audience and the precise goal of this content]
- **Core Message**: [The single most important takeaway — what must the audience remember?]
- **Tone & Voice**: [Style, personality, emotional register, and brand voice]
- **Key Sections**: [Detailed outline with specific sub-sections, bullet lists, and formatting cues]
- **Format Requirements**: [Length, structure, call-to-action placement, visual cues, SEO meta info]
- **SEO/Optimization Tags**: [Keywords, search intent, semantic NLP terms, internal linking cues]

RESPOND WITH VALID JSON ONLY. No markdown wrapper, no explanation, no text outside the JSON:
{
  "prompts": [
    "## Variant 1: [Name]\\n\\n[Complete expanded details]",
    "## Variant 2: [Name]\\n\\n[Complete expanded details]",
    "## Variant 3: [Name]\\n\\n[Complete expanded details]"
  ],
  "tips": [
    "**[Tip 1]**: Actionable advice",
    "**[Tip 2]**: Actionable advice",
    "**[Tip 3]**: Actionable advice",
    "**[Tip 4]**: Actionable advice"
  ]
}`;

// MASTER function removed — VIDEO_CATEGORIES use VIDEO_MASTER, SEO_CATEGORIES use SEO_MASTER

const VIDEO_CATEGORIES: Record<string, CategoryConfig> = {
  youtube_script: {
    label: "YouTube Video Script",
    systemPrompt: VIDEO_MASTER("YouTube scriptwriting", "High-retention scripts with: powerful 3-second hooks that stop the scroll, pattern interrupts every 60-90 seconds, storytelling arcs (setup → conflict → resolution), chapter markers, B-roll suggestions, and strong CTAs. Optimize for average view duration and audience retention. Use PAS (Problem-Agitate-Solution) and AIDA frameworks."),
  },
  video_hook: {
    label: "Hook & Intro (First 30s)",
    systemPrompt: VIDEO_MASTER("YouTube video hooks and intros", "The first 30 seconds determine 80% of retention. Specialize in: pattern interrupt openers, bold controversial statements, shocking statistics, curiosity loops ('stay till the end because...'), relatable problem openers, and before/after hooks. Every second must earn the next. Apply the 'open loop' technique."),
  },
  thumbnail: {
    label: "Thumbnail Design Prompt",
    systemPrompt: VIDEO_MASTER("AI image generation prompts for viral YouTube thumbnails", "Create DALL-E/Midjourney/Stable Diffusion prompts for thumbnails. Specify: ultra-high-contrast colors (yellow/red/orange on black), facial expressions (shocked/excited/curious), rule-of-thirds composition, text overlay placement, emotional trigger elements, lighting style (dramatic studio lighting), and clickbait visual cues. Reference proven viral thumbnail styles."),
  },
  video_title: {
    label: "Video Titles (SEO)",
    systemPrompt: VIDEO_MASTER("YouTube title optimization for CTR and search ranking", "Generate 10 SEO-optimized title options per variant using: curiosity gap technique, power words (Secret, Never, Finally, Why, How), numbers/lists, year indicators, question formats, emotional triggers, and primary keyword placement in first 60 characters. Balance click-through rate with YouTube search ranking."),
  },
  video_description: {
    label: "Video Description",
    systemPrompt: VIDEO_MASTER("YouTube description optimization", "Create keyword-rich descriptions for YouTube search ranking. Include: hook sentence (first 2 lines visible before 'Show more'), keyword-dense video summary, timestamps/chapters section, social links template, about channel section, and 3-5 relevant hashtags. Optimize for YouTube's algorithm and Google video search."),
  },
  cta: {
    label: "Call-to-Action Script",
    systemPrompt: VIDEO_MASTER("YouTube CTA and viewer conversion scripting", "Craft CTAs that convert without feeling pushy. Types: mid-roll engagement hooks, end-of-video subscribe asks, comment questions (algorithm-friendly), playlist transitions, membership pitches, and notification bell reminders. Use reciprocity principle — give value first, then ask. Time CTAs at natural content pauses."),
  },
  reels_tiktok: {
    label: "Reels / TikTok Script",
    systemPrompt: VIDEO_MASTER("short-form vertical video scripting for Reels, TikTok, and YouTube Shorts", "Short-form requires: instant hook in first 1-2 words, 15-60 second pacing, trending audio suggestions, text overlay timing cues, visual transition notes, trending format references (POV, 'Tell me without telling me', 'Day in the life'), and strong save/share triggers. Every frame must earn the next swipe."),
  },
  documentary: {
    label: "Documentary Narration",
    systemPrompt: VIDEO_MASTER("documentary and long-form narration scripting", "Craft authoritative narration with: atmospheric scene-setting opening, historical/contextual anchoring, emotional journey arc, expert quote placeholders, visual description cues, pacing notes (fast/slow/pause), and thought-provoking closing statement. Voice: David Attenborough gravitas meets modern YouTube accessibility."),
  },
  tutorial: {
    label: "Tutorial / How-To Script",
    systemPrompt: VIDEO_MASTER("educational tutorial and how-to video scripting", "Create beginner-friendly tutorials with: prerequisites check intro, numbered step-by-step breakdowns, 'why this matters' context for each step, common mistake warnings, pro tips throughout, troubleshooting section, and knowledge-check moments. Use the 'I do, we do, you do' teaching framework."),
  },
  product_review: {
    label: "Product Review Script",
    systemPrompt: VIDEO_MASTER("authentic product review video scripting", "Create honest, structured reviews that build trust and affiliate conversions. Include: unboxing/first impressions section, deep-dive feature walkthroughs, real-world use case testing, pros vs. cons with context, comparison to alternatives, who should/shouldn't buy verdict, and affiliate disclaimer placement. Credibility > hype."),
  },
  vlog: {
    label: "Vlog Story Arc",
    systemPrompt: VIDEO_MASTER("vlog storytelling and narrative structure", "Transform daily experiences into compelling stories. Use: opening teaser (best moment first), 3-act structure (ordinary world → challenge/adventure → resolution), character moments, conflict hooks ('then something unexpected happened'), emotional highs and lows, and reflective closing lesson. Make viewers feel they experienced it."),
  },
  podcast_notes: {
    label: "Podcast Show Notes",
    systemPrompt: VIDEO_MASTER("podcast show notes and episode descriptions", "Create SEO-optimized show notes. Include: episode hook summary (first 150 words), 5-7 key takeaway bullets, chapter timestamps, guest bio (with template), 'Resources mentioned' section, episode transcript teaser, and 3 social sharing hooks for Twitter/LinkedIn. Optimize for podcast app search and Google."),
  },
  youtube_shorts: {
    label: "YouTube Shorts Script",
    systemPrompt: VIDEO_MASTER("YouTube Shorts scripting (max 60 seconds)", "YouTube Shorts are the fastest path to discoverability. Create: 3-second visual hook with text, rapid value delivery, one clear insight or tip per Short, text overlay timing guide (on-screen captions), strong loop potential (viewers rewatch), and a cliffhanger or part-2 tease. Think TikTok energy with YouTube searchability."),
  },
  video_ad: {
    label: "Video Ad Script",
    systemPrompt: VIDEO_MASTER("video advertising and paid media scripting", "Create unskippable video ads using proven conversion frameworks. Versions: 6-second bumper (brand awareness), 15-second pre-roll (skip-proof hook), 30-second full ad (full AIDA). Include: disruptive visual/audio hook, pain point identification, solution reveal, social proof moment, risk reversal, and urgent CTA. The goal: conversions, not awareness."),
  },
  explainer: {
    label: "Educational Explainer Video",
    systemPrompt: VIDEO_MASTER("educational explainer video scripting", "Simplify complex topics for mass understanding. Use: ELI5 (Explain Like I'm 5) language, analogies to everyday objects, visual metaphor suggestions, progressive complexity (simple → nuanced), real-world consequence examples, memorable frameworks and acronyms, and a 'so what?' closing. Make viewers feel smart, not talked down to."),
  },
  interview: {
    label: "Interview Questions",
    systemPrompt: VIDEO_MASTER("interview question development for video content", "Craft questions that reveal authentic stories and expertise. Structure: 3 warm-up rapport questions, 5 deep-dive expertise questions, 2 challenge/controversy questions (tasteful), 2 future-vision questions, and 1 signature closing question. Add follow-up prompts for each. The best interviews are conversations, not interrogations."),
  },
  channel_trailer: {
    label: "Channel Trailer Script",
    systemPrompt: VIDEO_MASTER("YouTube channel trailer scripting", "The channel trailer converts first-time visitors into loyal subscribers. 60-90 seconds max. Structure: bold hook statement about the transformation you offer, 'If you're someone who...' audience identification, rapid content value preview, social proof mention, and compelling subscribe CTA with specific reason. Aspirational > informational."),
  },
  outro: {
    label: "Outro / End Screen Script",
    systemPrompt: VIDEO_MASTER("YouTube outro and end screen scripting", "Maximize watch-time and channel growth with end-of-video sequences. Under 30 seconds. Include: 1-sentence video summary callback, 'If you liked this...' transition, next video recommendation with curiosity hook, subscribe pitch with specific benefit, comment engagement question (algorithm fuel), and playlist nudge. Viewers who watch outros are your most engaged fans."),
  },
  commentary: {
    label: "Commentary Script",
    systemPrompt: VIDEO_MASTER("commentary and reaction video scripting", "Create commentary that entertains AND informs. Tone: conversational, opinionated, credible. Structure: context-setting intro for new viewers, main commentary points (with your unique take), steel-manning opposing views, memorable one-liner soundbites, audience engagement question, and clear conclusion/verdict. Opinion is your brand — own it."),
  },
  channel_strategy: {
    label: "Channel Growth Strategy",
    systemPrompt: VIDEO_MASTER("YouTube channel growth strategy and content planning", "Create prompts for complete channel growth blueprints. Cover: niche positioning and differentiation angle, 3-5 content pillars, upload schedule (realistic for creator's capacity), thumbnail and title formula, community building tactics (comments, polls, community posts), monetization roadmap (ads → memberships → brand deals → products), and 90-day action plan."),
  },
};

const SEO_CATEGORIES: Record<string, CategoryConfig> = {
  blog_outline: {
    label: "Blog Post Outline",
    systemPrompt: SEO_MASTER("SEO blog post outlining and content strategy", "Create comprehensive outlines that rank on Google. Include: primary + secondary keyword strategy, H1/H2/H3/H4 structure, search intent alignment (informational/commercial), word count and reading time targets, featured snippet optimization opportunities, NLP semantic keyword integration, internal link suggestions, and content differentiation from top SERP results."),
  },
  meta_tags: {
    label: "Meta Tags & Description",
    systemPrompt: SEO_MASTER("SEO meta tag optimization for click-through rate", "Create meta titles (50-60 chars) and descriptions (150-160 chars) that dominate CTR. Apply: primary keyword in first 3 words, power words (Free, Best, Complete, Proven), emotional triggers, unique value proposition, and year if relevant. Also generate: Open Graph title/description, Twitter Card tags, and 5 A/B testing title variants. Track CTR, not just ranking."),
  },
  keywords: {
    label: "Keyword Research Strategy",
    systemPrompt: SEO_MASTER("keyword research and SEO opportunity identification", "Create prompts for comprehensive keyword strategies. Cover: head terms (high volume/high competition), body keywords (medium volume), long-tail gems (low competition/high intent), question keywords for featured snippets, voice search queries, negative keyword list, search intent classification (TOFU/MOFU/BOFU), and content gap opportunities vs. competitors."),
  },
  content_brief: {
    label: "SEO Content Brief",
    systemPrompt: SEO_MASTER("SEO content brief creation for writers", "Create briefs that produce ranking content. Include: primary keyword + monthly search volume, secondary keywords (8-12), search intent analysis, target audience persona, recommended word count, SERP analysis summary (what ranks and why), required H2/H3 sections, statistics and data sources to cite, internal links to include, E-E-A-T signals needed (expertise, experience, authority, trust), and competitor content to beat."),
  },
  homepage_copy: {
    label: "Website Homepage Copy",
    systemPrompt: SEO_MASTER("website homepage copywriting and conversion optimization", "Create homepage copy that converts visitors to customers. Sections: hero headline (one clear benefit promise), sub-headline (who it's for and the outcome), social proof bar (logos/numbers), 3-pillar benefits section, how-it-works (3 steps), testimonials placeholder, FAQ (top 3 objections), and primary CTA (repeated 3 times). Every word must earn its place."),
  },
  social_captions: {
    label: "Social Media Captions",
    systemPrompt: SEO_MASTER("platform-optimized social media caption writing", "Create captions tuned for each platform's algorithm. Instagram: storytelling hook + value + hashtag strategy (20-25 targeted). Twitter/X: punchy + quotable + thread potential. LinkedIn: professional insight + vulnerability + engagement question. Facebook: conversational + community-focused. TikTok/Reels: trend-aware hook + music suggestion. Include engagement bait questions and optimal posting time notes."),
  },
  email_newsletter: {
    label: "Email Newsletter",
    systemPrompt: SEO_MASTER("email newsletter writing and deliverability optimization", "Create newsletters that get opened AND clicked. Include: subject line (5 variants using curiosity/benefit/personalization), preview text (pair with subject for 1-2 punch), personalized opening hook, main value section (teach/entertain/inspire), story or case study, single clear CTA button, and P.S. line (most-read section — use for secondary CTA). Keep scannability: short paragraphs, one idea per paragraph."),
  },
  press_release: {
    label: "Press Release",
    systemPrompt: SEO_MASTER("press release writing and media outreach", "Create journalistic press releases that earn coverage. Follow AP style strictly. Include: attention-grabbing headline (present tense verb), sub-headline, dateline, inverted-pyramid lead paragraph (who/what/when/where/why/how in 40 words), 2-3 body paragraphs building context, executive quote (newsworthy, not promotional), boilerplate company description, and media contact block. Hook journalists in sentence 1 — they decide in 3 seconds."),
  },
  product_desc: {
    label: "Product Description",
    systemPrompt: SEO_MASTER("e-commerce product description writing and conversion optimization", "Create descriptions that convert browsers to buyers. Formula: benefit-led headline (outcome, not feature), sensory language (how it feels/smells/sounds), feature-to-benefit translation ('Dual microphone' → 'Crystal-clear calls even in noisy cafes'), objection-handling copy, social proof signal, SEO keyword integration (natural, not stuffed), urgency element, and scannable bullet section. Benefits sell. Features just validate."),
  },
  landing_page: {
    label: "Landing Page Copy",
    systemPrompt: SEO_MASTER("landing page copywriting and conversion rate optimization", "Create landing pages that convert. Use PAS or AIDA framework. Sections: headline (one big promise), sub-headline (specificity + credibility), hero visual description, pain agitation (empathy section), solution reveal (your product as the hero), benefits (5-7 bullets — outcomes not features), social proof (testimonials with full names + results), FAQ (top 5 objections as questions), risk reversal (guarantee), and CTA (with micro-copy to reduce friction). Aim for 3-5% conversion rate."),
  },
  faq: {
    label: "FAQ Section",
    systemPrompt: SEO_MASTER("FAQ section creation for SEO, UX, and conversion", "Create FAQs that rank in featured snippets and reduce purchase hesitation. Include: 15-20 real questions (from Reddit, Quora, search autocomplete — not assumed), concise answers (40-60 words for snippet eligibility), questions structured for voice search ('What is...', 'How do I...', 'Can I...'), FAQ schema markup instructions, category groupings (Before Purchase / During Use / Pricing / Technical), and cross-sell opportunities embedded naturally."),
  },
  linkedin_article: {
    label: "LinkedIn Article",
    systemPrompt: SEO_MASTER("LinkedIn thought leadership article writing", "Create articles that build authority and generate inbound leads. Formula: controversial or counterintuitive hook statement (first line — no context), relatable story or personal mistake, insight extracted from story, frameworks or numbered principles, specific actionable advice (not generic), humility moment (builds trust), engagement-driving question at end. Tone: professional but vulnerable. Distribution tip: post summary as status update with link."),
  },
  business_proposal: {
    label: "Business Proposal",
    systemPrompt: SEO_MASTER("business proposal writing and closing strategy", "Create proposals that win contracts. Sections: executive summary (problem + solution + investment — one page), understanding of client's problem (shows research — they feel heard), proposed solution (methodology, not features), timeline with milestones, team credentials (specific to this project), tiered pricing (3 options — guide them to middle), ROI projection (conservative estimate), social proof (1-2 relevant case studies), and clear next-step CTA. Price last, value first."),
  },
  case_study: {
    label: "Case Study",
    systemPrompt: SEO_MASTER("case study and client success story writing", "Create case studies that convert warm leads. Structure: attention-grabbing headline with results metric, client situation before (make them the relatable hero in struggle), specific challenges faced (3 pain points), solution implemented (your methodology — not just product), results achieved (specific, attributed, time-boxed numbers), client direct quote (authentic, specific), and 2-3 key learnings. The client is the hero. You are the guide."),
  },
  google_ads: {
    label: "Google Ads Copy",
    systemPrompt: SEO_MASTER("Google Ads copywriting and Quality Score optimization", "Create high-CTR ad copy that drives qualified clicks. Generate: 15 headlines (30 chars max each — keyword in at least 5), 4 descriptions (90 chars max each), 5 sitelink extensions with descriptions, 5 callout extensions, 3 structured snippet categories, 10 negative keywords to exclude, and landing page alignment notes. Apply: FOMO, social proof signals, specific numbers, power words, and keyword insertion best practices. Target QS 8+."),
  },
  brand_story: {
    label: "Brand Story",
    systemPrompt: SEO_MASTER("brand storytelling and origin narrative development", "Create brand stories that create emotional loyalty. Use hero's journey adapted for business: ordinary world (founder's relatable situation), the problem/villain (industry flaw or personal struggle), the discovery/turning point, the transformation (what they built), the mission (why it matters to customer), and the invitation (customer as hero). Applications: website About page, pitch deck slide, Instagram bio, PR interviews. Authentic specificity wins over polished corporate speak."),
  },
  cold_email: {
    label: "Cold Outreach Email",
    systemPrompt: SEO_MASTER("cold email and sales outreach copywriting", "Create cold emails that get replies (not spam-foldered). Framework: research-specific first line (no 'I hope this email finds you well'), one-sentence value prop (what you do for people exactly like them), social proof signal (specific client or result), single friction-free CTA ('Worth a 15-min call this week?'). Under 150 words. Include: 3 subject line variants (A/B/C test), 3-email follow-up sequence (days 3 and 7), and breakup email (day 14). The goal is a reply, not a sale."),
  },
  seo_audit: {
    label: "SEO Audit Checklist",
    systemPrompt: SEO_MASTER("SEO audit prompting and technical SEO analysis", "Create prompts for comprehensive audits covering: Technical SEO (Core Web Vitals LCP/FID/CLS scores, mobile usability, crawl budget, XML sitemap, robots.txt, canonical tags, 301 redirect chains, broken links), On-Page SEO (title/meta optimization, header hierarchy, image alt text, internal linking structure, content depth), Off-Page SEO (backlink profile quality, DA/DR analysis, toxic link identification), and Content Audit (thin content, duplicate content, keyword cannibalization). Output: prioritized fix list with impact vs. effort matrix."),
  },
  youtube_seo: {
    label: "YouTube SEO Strategy",
    systemPrompt: SEO_MASTER("YouTube search optimization and video discoverability strategy", "Create YouTube SEO strategies that drive organic views. Cover: keyword research for video (YouTube autocomplete, VidIQ/TubeBuddy data), title formula (keyword + curiosity gap), description optimization (keyword in first 2 lines + full keyword-rich summary + chapters), tag strategy (mix of broad/niche/competitor tags), thumbnail CTR optimization, playlist architecture for session time, end screen optimization for suggested videos, and community tab engagement strategy for algorithm signals."),
  },
  competitor_analysis: {
    label: "Competitor Analysis",
    systemPrompt: SEO_MASTER("competitor analysis and market positioning strategy", "Create prompts for in-depth competitive intelligence. Cover: competitor identification (direct/indirect/aspirational), content gap analysis (what they rank for that you don't), backlink opportunity discovery (their links you could earn), pricing and positioning comparison, social media strategy analysis, SWOT framework applied to each competitor, blue ocean opportunities they're missing, and differentiation positioning strategy. Output: actionable competitive advantage and 90-day attack plan."),
  },
};

router.post("/generate", async (req, res) => {
  const { category, tool, userInput } = req.body as {
    category?: string;
    tool?: string;
    userInput?: string;
  };

  if (!category || !tool || !userInput) {
    return res.status(400).json({ error: "category, tool, and userInput are required" });
  }

  const allCategories: Record<string, CategoryConfig> = {
    ...VIDEO_CATEGORIES,
    ...SEO_CATEGORIES,
  };

  const config = allCategories[tool];
  if (!config) {
    return res.status(400).json({ error: `Unknown tool: ${tool}` });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "GROQ_API_KEY is not configured.",
    });
  }

  try {
    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: config.systemPrompt },
        {
          role: "user",
          content: `Transform this rough idea into 3 expertly engineered AI prompts:\n\n"${userInput}"\n\nRespond with ONLY valid JSON. The "prompts" array must have exactly 3 strings using full Markdown formatting (headings, bold, bullets). The "tips" array must have exactly 4 strings. No text outside the JSON object.`,
        },
      ],
      max_tokens: 3000,
      temperature: 0.82,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "{}";

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: "AI response parsing failed." });
    }

    const prompts: string[] = Array.isArray(parsed.prompts)
      ? parsed.prompts.filter((p: any) => typeof p === "string").slice(0, 3)
      : [];

    const tips: string[] = Array.isArray(parsed.tips)
      ? parsed.tips.filter((t: any) => typeof t === "string").slice(0, 5)
      : [];

    if (prompts.length === 0) {
      return res.status(500).json({ error: "AI failed to generate prompts." });
    }

    return res.json({ prompts, tips, label: config.label });
  } catch (err: any) {
    console.error("Groq error:", err?.message ?? err);
    return res.status(500).json({
      error: err?.message ?? "AI generation failed.",
    });
  }
});

export default router;