"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CalendarSync,
  CircleDot,
  FileText,
  Image,
  LockKeyhole,
  Music4,
  Sparkles,
  UserPlus,
  Video,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

type Language = "tr" | "en";
type AuthMode = "login" | "register";
type ChatModule = "AI Video" | "AI Image" | "AI Text" | "AI Sound";
type Priority = "Hız" | "Maliyet" | "Kalite-Denge";
type RouterMode = "auto" | "manual";

type IntentResult = {
  module: ChatModule;
  priority: Priority;
  agentName: string;
  model: string;
  reason: string;
};

type RouterChatMessage = {
  role: "user" | "assistant";
  text: string;
  intent?: IntentResult;
};

const headerItems = {
  tr: ["AI Video", "AI Image", "AI Text", "AI Sound", "AI Pro Tools", "Stock Data"],
  en: ["AI Video", "AI Image", "AI Text", "AI Sound", "AI Pro Tools", "Stock Data"],
} as const;

const cards = [
  {
    title: "Chat with all models",
    text: "Tüm modelleri tek panelde birleştir, kıyasla ve üret.",
    icon: Bot,
  },
  {
    title: "AI as thought partner",
    text: "Hızlı içgörüler, net aksiyon listeleri ve güçlü karar metinleri.",
    icon: BrainCircuit,
  },
  {
    title: "Meeting + workflow sync",
    text: "Toplantı notlarını otomatik özetle, görevleri takvime aktar.",
    icon: CalendarSync,
  },
];

const apiItems = [
  "Sora",
  "GPT-5",
  "Claude 3.5 Sonnet",
  "Gemini 1.5 Pro",
  "Midjourney",
  "Sora Video",
];

const controlDeck = [
  {
    title: "AI Video",
    description: {
      tr: "Video fikirlerini sahne sahne üret, düzenle ve tek panelden yayınla.",
      en: "Create scene-by-scene videos, edit, and publish from a single panel.",
    },
    icon: Video,
    preview: "video",
  },
  {
    title: "AI Image",
    description: {
      tr: "Görsel üretim, varyasyon ve stil iterasyonlarını tek akışta yönet.",
      en: "Manage image generation, variations, and style iterations in one flow.",
    },
    icon: Image,
    preview: "image",
  },
  {
    title: "AI Text",
    description: {
      tr: "Brief, script, blog, kampanya metinleri ve dokümanları saniyeler içinde çıkar.",
      en: "Generate briefs, scripts, blogs, campaign copy, and docs in seconds.",
    },
    icon: FileText,
    preview: "text",
  },
  {
    title: "AI Sound",
    description: {
      tr: "Ses tasarımı, voiceover, müzik ve mastering süreçlerini tek yerden kontrol et.",
      en: "Control sound design, voice-over, music, and mastering from one place.",
    },
    icon: Music4,
    preview: "sound",
  },
];

const copy = {
  tr: {
    login: "Giriş",
    startNow: "Start Free Now",
    heroEyebrow: "AKİYOM AI",
    heroTitle1: "Düşün, yaz, üret.",
    heroTitle2: "Tek AI merkezinde.",
    heroDesc:
      "AI sağlayıcılarını tek merkezde birleştir. Sora, GPT, Claude, Gemini, Midjourney ve daha fazlasını tek bir premium workflow içinde yönet.",
    freeStart: "Ücretsiz Başla",
    demo: "Demo Gör",
    welcomeEyebrow: "Müşteriyi Karşılayan Alan",
    welcomeTitle1: "Tek tek araçlarla uğraşma.",
    welcomeTitle2: "Hepsine tek yerden hükmet.",
    welcomeDesc:
      "AI Video, AI Image, AI Text ve AI Sound iş akışlarını tek merkezde birleştir. Ekipler daha hızlı karar alır, üretim kesintisiz devam eder.",
    thinkTitle: "Think better with AI",
    pricingStarterDesc: "Solo üreticiler için hızlı başlangıç paketi.",
    pricingProDesc: "Ekipler için en iyi fiyat/performans planı.",
    pricingTeamDesc: "Yoğun üretim yapan ajans ve ekipler için.",
    choosePlan: "Planı Seç",
    trustedBy: "Trusted by production teams",
    waitlistTitle: "Erken erişim listesine katıl",
    waitlistDesc:
      "Supabase entegrasyonunu sonra açacağız. Şimdilik bu form UI akışını hazır tutar.",
    waitlistBtn: "Waitlist'e Katıl",
    waitlistSuccess: "Kaydın alındı. Entegrasyon hazır olduğunda seni bilgilendireceğiz.",
    waitlistPlaceholder: "ornek@akiyom.com",
    referralTitle: "Arkadaşını getir, kazan",
    referralDesc:
      "Davet ettiğin her arkadaşın ilk satın alımında kredi kazan. Arkadaşın indirim alırken sen de hesabını büyüt.",
    referralYouGet: "Senin kazancın",
    referralFriendGets: "Arkadaşının kazancı",
    referralReward: "2500 kredi",
    referralDiscount: "%20 ilk ay indirimi",
    referralLinkLabel: "Davet bağlantın",
    referralLinkAction: "Bağlantıyı Kopyala",
    referralInviteTitle: "E-posta ile davet et",
    referralInvitePlaceholder: "arkadasin@email.com",
    referralInviteButton: "Davet Gönder",
    referralSuccess: "Davet gönderildi. Arkadaşın katıldığında ödülün hesabına yansıtılacak.",
    authEyebrow: "Hesabınla devam et",
    authTitle: "Giriş yap veya yeni hesap oluştur",
    authDesc:
      "Platform kullanıma hazır. Şimdilik bu bölüm UI akışını simüle eder, backend bağlantısı sonraki adımda eklenir.",
    loginTab: "Giriş",
    registerTab: "Kayıt Ol",
    nameLabel: "Ad Soyad",
    emailLabel: "E-posta",
    passwordLabel: "Şifre",
    forgotPassword: "Şifremi unuttum",
    loginAction: "Giriş Yap",
    registerAction: "Hesap Oluştur",
    authSuccessLogin: "Giriş isteği alındı. Hesabın doğrulandığında yönlendirileceksin.",
    authSuccessRegister:
      "Kayıt isteği alındı. Hesabını aktive etmek için e-posta adımlarını tamamlayacağız.",
  },
  en: {
    login: "Sign In",
    startNow: "Start Free Now",
    heroEyebrow: "AKIYOM AI",
    heroTitle1: "Think, write, create.",
    heroTitle2: "In one AI hub.",
    heroDesc:
      "Unify AI providers in one place. Manage Sora, GPT, Claude, Gemini, Midjourney, and more in a single premium workflow.",
    freeStart: "Start Free",
    demo: "View Demo",
    welcomeEyebrow: "Customer Welcome Section",
    welcomeTitle1: "Stop juggling tools one by one.",
    welcomeTitle2: "Control everything from one place.",
    welcomeDesc:
      "Combine AI Video, AI Image, AI Text, and AI Sound workflows in one center. Teams move faster and ship consistently.",
    thinkTitle: "Think better with AI",
    pricingStarterDesc: "Fast-start plan for solo creators.",
    pricingProDesc: "Best value plan for growing teams.",
    pricingTeamDesc: "For agencies and high-output teams.",
    choosePlan: "Choose Plan",
    trustedBy: "Trusted by production teams",
    waitlistTitle: "Join early access",
    waitlistDesc:
      "We will plug in Supabase later. For now, this keeps the waitlist UI flow ready.",
    waitlistBtn: "Join Waitlist",
    waitlistSuccess: "You're on the list. We'll notify you when integration is ready.",
    waitlistPlaceholder: "name@company.com",
    referralTitle: "Invite friends, earn rewards",
    referralDesc:
      "Earn credits when your invited friends make their first purchase. They get a discount, you grow your account.",
    referralYouGet: "You get",
    referralFriendGets: "Friend gets",
    referralReward: "2500 credits",
    referralDiscount: "20% off first month",
    referralLinkLabel: "Your invite link",
    referralLinkAction: "Copy Link",
    referralInviteTitle: "Invite by email",
    referralInvitePlaceholder: "friend@email.com",
    referralInviteButton: "Send Invite",
    referralSuccess: "Invite sent. Your reward will be credited when your friend joins.",
    authEyebrow: "Continue with your account",
    authTitle: "Sign in or create a new account",
    authDesc:
      "The platform is ready. This section simulates the UI flow for now; backend integration comes next.",
    loginTab: "Sign In",
    registerTab: "Sign Up",
    nameLabel: "Full Name",
    emailLabel: "Email",
    passwordLabel: "Password",
    forgotPassword: "Forgot password?",
    loginAction: "Sign In",
    registerAction: "Create Account",
    authSuccessLogin: "Sign-in request received. You'll be redirected after verification.",
    authSuccessRegister:
      "Sign-up request received. We'll guide activation via email steps.",
  },
} as const;

const pricingPlans = [
  {
    name: "Starter",
    price: "$19",
    description: "Solo üreticiler için hızlı başlangıç paketi.",
    features: ["AI Video/Image/Text/Sound", "Aylık 10.000 kredi", "Topluluk desteği"],
  },
  {
    name: "Pro",
    price: "$49",
    description: "Ekipler için en iyi fiyat/performans planı.",
    features: ["Tüm premium modeller", "Aylık 50.000 kredi", "Öncelikli destek"],
    highlighted: true,
  },
  {
    name: "Team",
    price: "$129",
    description: "Yoğun üretim yapan ajans ve ekipler için.",
    features: ["Sınırsız koltuk", "Özel workflow şablonları", "SLA destek"],
  },
];

const trustLogos = ["NOVA MEDIA", "PIXELHOUSE", "STUDIOFLOW", "AURORA LABS", "NEXA"];
const routerQuickPrompts = [
  "Bana kırmızı bir araba çiz",
  "30 saniyelik ürün tanıtım videosu üret",
  "Satış sayfası için ikna edici metin yaz",
  "Cinematic bir arka plan müziği üret",
];
const manualModelsByModule: Record<ChatModule, string[]> = {
  "AI Video": ["Sora", "Runway Gen-3 Turbo", "Luma Dream Machine Lite"],
  "AI Image": ["Midjourney v6", "FLUX Schnell", "SDXL Turbo"],
  "AI Text": ["Claude 3.5 Sonnet", "GPT-4.1 mini", "Gemini Flash"],
  "AI Sound": ["Suno v4", "Suno Fast", "Udio Standard"],
};

const progressCopy = {
  status1: "🤖 AkiAgent mesajınızı okuyor...",
  status2: "🔍 İstek türü ve karmaşıklık analiz ediliyor...",
  status6Image: "✨ Pikseller senin için optimize ediliyor...",
  status6Text: "✨ Kelimeler senin için optimize ediliyor...",
  status6Sound: "✨ Ses dalgaları senin için optimize ediliyor...",
  status6Video: "✨ Kareler senin için optimize ediliyor...",
} as const;

const STAR_COUNT = 96;

const warpStars = Array.from({ length: STAR_COUNT }, (_, i) => {
  const angle = (Math.PI * 2 * i) / STAR_COUNT;
  const x = Math.cos(angle) * (760 + (i % 8) * 90);
  const y = Math.sin(angle) * (430 + (i % 6) * 80);
  return {
    id: i,
    x,
    y,
    delay: (i % 12) * 0.16,
    duration: 2.8 + (i % 5) * 0.35,
  };
});

export default function Home() {
  const backgroundVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const crossfadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeBackgroundVideo, setActiveBackgroundVideo] = useState(0);
  const [isBackgroundCrossfading, setIsBackgroundCrossfading] = useState(false);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const [language, setLanguage] = useState<Language>("tr");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authDone, setAuthDone] = useState(false);
  const [routerInput, setRouterInput] = useState("");
  const [routerMode, setRouterMode] = useState<RouterMode>("auto");
  const [manualModule, setManualModule] = useState<ChatModule>("AI Image");
  const [manualPriority, setManualPriority] = useState<Priority>("Kalite-Denge");
  const [manualModel, setManualModel] = useState(manualModelsByModule["AI Image"][0]);
  const [routerStatuses, setRouterStatuses] = useState<string[]>([]);
  const [isRouterProcessing, setIsRouterProcessing] = useState(false);
  const [routerChat, setRouterChat] = useState<RouterChatMessage[]>([]);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referralEmail, setReferralEmail] = useState("");
  const [isReferralSubmitted, setIsReferralSubmitted] = useState(false);
  const t = copy[language];
  const hasManualAccess = authDone;

  const onSubmitWaitlist = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setIsSubmitted(true);
    setEmail("");
  };

  const onSubmitReferral = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!referralEmail.trim()) return;
    setIsReferralSubmitted(true);
    setReferralEmail("");
  };

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    setAuthDone(false);
  };

  const onSubmitAuth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) return;
    if (authMode === "register" && !authName.trim()) return;
    setAuthDone(true);
    setAuthName("");
    setAuthEmail("");
    setAuthPassword("");
  };

  const onSubmitRouter = (event: FormEvent<HTMLFormElement>) => {
    const pushStatus = (status: string) => {
      setRouterStatuses((prev) => [...prev, status]);
    };

    const status6ByModule: Record<ChatModule, string> = {
      "AI Video": progressCopy.status6Video,
      "AI Image": progressCopy.status6Image,
      "AI Text": progressCopy.status6Text,
      "AI Sound": progressCopy.status6Sound,
    };

    const postJson = async <T,>(url: string, payload: unknown): Promise<T> => {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Request failed: ${url}`);
      }
      return (await response.json()) as T;
    };

    const run = async () => {
      setIsRouterProcessing(true);
      setRouterStatuses([]);
      pushStatus(progressCopy.status1);

      pushStatus(progressCopy.status2);
      const analysis = await postJson<{
        module: ChatModule;
        priority: Priority;
        requestType: string;
        isChatOnly: boolean;
      }>(
        "/api/router/analyze",
        { prompt }
      );

      if (analysis.isChatOnly) {
        setRouterStatuses([]);
        setRouterChat((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Bu istek chat olarak algılandı; hızlı cevap modu ile devam ediyoruz.",
            intent: {
              module: "AI Text",
              priority: analysis.priority,
              agentName: "Quick Chat Agent",
              model: "Gemini Flash",
              reason: "Sadece sohbet isteği olduğu için yönlendirme pipeline'ı atlandı.",
            },
          },
        ]);
        setIsRouterProcessing(false);
        return;
      }

      pushStatus(`✅ Analiz tamamlandı: ${analysis.requestType} tespit edildi.`);
      const effectiveModule = routerMode === "manual" && hasManualAccess ? manualModule : analysis.module;
      const effectivePriority = routerMode === "manual" && hasManualAccess ? manualPriority : "Maliyet";
      let assignment: { agentName: string; model: string; reason: string };

      if (routerMode === "manual" && hasManualAccess) {
        pushStatus(`⚙️ Manuel seçim aktif: ${effectiveModule} için ${manualModel} hazırlanıyor...`);
        assignment = {
          agentName: `${effectiveModule.replace("AI ", "")} Studio Agent`,
          model: manualModel,
          reason: "Manuel modda kullanıcı seçimine göre agent/model atandı.",
        };
      } else {
        pushStatus("⚙️ Auto mod: hızlı ve düşük maliyetli agent seçiliyor...");
        assignment = await postJson<{ agentName: string; model: string; reason: string }>(
          "/api/router/select-agent",
          { module: effectiveModule, priority: effectivePriority }
        );
      }

      pushStatus(`🚀 ${assignment.agentName} sunucuya bağlandı, üretim başlıyor.`);
      await postJson<{ jobId: string; accepted: boolean }>("/api/router/start-job", {
        agentName: assignment.agentName,
        prompt,
        module: effectiveModule,
      });

      pushStatus(status6ByModule[effectiveModule]);

      const intent: IntentResult = {
        module: effectiveModule,
        priority: effectivePriority,
        agentName: assignment.agentName,
        model: assignment.model,
        reason: assignment.reason,
      };
      const assistantText = `Niyetini "${intent.module}" olarak algıladım. "${intent.agentName}" (${intent.model}) ile devam ediyoruz.`;

      setRouterChat((prev) => [...prev, { role: "assistant", text: assistantText, intent }]);
      setIsRouterProcessing(false);
    };

    event.preventDefault();
    const prompt = routerInput.trim();
    if (!prompt) return;
    if (routerMode === "manual" && !hasManualAccess) {
      setRouterChat((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Manuel model seçimi üyelik gerektiriyor. Devam etmek için kayıt ol.",
        },
      ]);
      openAuth("register");
      return;
    }

    setRouterChat((prev) => [...prev, { role: "user", text: prompt }]);
    setRouterInput("");
    void run().catch(() => {
      setRouterStatuses((prev) => [...prev, "❌ İşlem sırasında bir hata oluştu. Lütfen tekrar dene."]);
      setRouterChat((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Geçici bir hata oldu. İstersen aynı isteği tekrar deneyelim.",
        },
      ]);
      setIsRouterProcessing(false);
    });
  };

  useEffect(() => {
    const startFirstVideo = () => {
      const firstVideo = backgroundVideoRefs.current[0];
      if (!firstVideo) return;
      void firstVideo.play();
    };

    startFirstVideo();

    return () => {
      if (crossfadeTimeoutRef.current) {
        clearTimeout(crossfadeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    backgroundVideoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (isAnimationPaused) {
        video.pause();
        return;
      }

      if (index === activeBackgroundVideo) {
        void video.play();
      }
    });
  }, [isAnimationPaused, activeBackgroundVideo]);

  const startBackgroundCrossfade = () => {
    if (isAnimationPaused || isBackgroundCrossfading) return;

    const currentIndex = activeBackgroundVideo;
    const nextIndex = currentIndex === 0 ? 1 : 0;
    const currentVideo = backgroundVideoRefs.current[currentIndex];
    const nextVideo = backgroundVideoRefs.current[nextIndex];
    if (!currentVideo || !nextVideo) return;

    setIsBackgroundCrossfading(true);
    nextVideo.currentTime = 0;
    void nextVideo.play();
    setActiveBackgroundVideo(nextIndex);

    if (crossfadeTimeoutRef.current) {
      clearTimeout(crossfadeTimeoutRef.current);
    }

    crossfadeTimeoutRef.current = setTimeout(() => {
      currentVideo.pause();
      currentVideo.currentTime = 0;
      setIsBackgroundCrossfading(false);
    }, 850);
  };

  const onBackgroundTimeUpdate = (index: number) => {
    if (isAnimationPaused) return;
    if (index !== activeBackgroundVideo) return;

    const currentVideo = backgroundVideoRefs.current[index];
    if (!currentVideo || !Number.isFinite(currentVideo.duration)) return;

    const overlapSeconds = 0.85;
    if (currentVideo.currentTime >= currentVideo.duration - overlapSeconds) {
      startBackgroundCrossfade();
    }
  };

  const onBackgroundLoadedMetadata = (index: number) => {
    if (index === activeBackgroundVideo) {
      const firstVideo = backgroundVideoRefs.current[0];
      const activeVideo = backgroundVideoRefs.current[index];
      if (activeVideo && activeVideo.paused) {
        void activeVideo.play();
      } else if (firstVideo && firstVideo.paused) {
        void firstVideo.play();
      }
    }
  };

  const renderControlPreview = (preview: "video" | "image" | "text" | "sound", title: string) => {
    if (preview === "video") {
      return (
        <div className="relative mb-3 h-24 overflow-hidden rounded-xl border border-white/10 bg-black/40">
          <video className="h-full w-full object-cover opacity-75" autoPlay loop muted playsInline preload="metadata">
            <source src="/video/Kara_Delik.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span className="absolute bottom-2 right-2 rounded-full border border-white/20 bg-black/45 px-2 py-0.5 text-[10px] text-white">
            LIVE PREVIEW
          </span>
        </div>
      );
    }

    if (preview === "image") {
      return (
        <div className="mb-3 grid h-24 grid-cols-3 gap-1.5">
          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-[#6ea8ff66] to-[#a98dff3d]" />
          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-[#ffbe7a4f] to-[#ff8fd14a]" />
          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-[#75ffd05c] to-[#6e88ff47]" />
          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-[#8091ff4f] to-[#96f7ff4f]" />
          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-[#ffc2a74f] to-[#ffe27f45]" />
          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-[#c09dff57] to-[#88b7ff4a]" />
        </div>
      );
    }

    if (preview === "text") {
      return (
        <div className="mb-3 h-24 space-y-1.5 rounded-xl border border-white/10 bg-black/35 p-2.5">
          <div className="ml-auto w-[72%] rounded-lg bg-[#9aa8ff2e] px-2 py-1 text-[10px] text-[#e4e8ff]">
            Yeni ürün lansmanı için kısa bir metin yazar mısın?
          </div>
          <div className="w-[84%] rounded-lg bg-white/[0.08] px-2 py-1 text-[10px] text-[#d8dbe2]">
            Tabii. Hedef kitleyi ve tonu belirtirsen 3 farklı versiyon hazırlayabilirim.
          </div>
          <div className="ml-auto w-[64%] rounded-lg bg-[#9aa8ff24] px-2 py-1 text-[10px] text-[#dfe4ff]">
            Dinamik ve genç bir ton olsun.
          </div>
        </div>
      );
    }

    return (
      <div className="mb-3 h-24 rounded-xl border border-white/10 bg-black/35 p-2.5">
        <div className="flex h-full items-end justify-between gap-1">
          {[30, 58, 44, 70, 52, 78, 48, 66, 36, 56, 42, 64].map((height, index) => (
            <span
              key={`${title}-wave-${index}`}
              className="w-2 rounded-full bg-gradient-to-t from-[#90a2ff5e] to-[#d6ddffcf]"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-[#F5F5F5]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {[0, 1].map((index) => (
          <video
            key={index}
            ref={(element) => {
              backgroundVideoRefs.current[index] = element;
            }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              activeBackgroundVideo === index ? "opacity-35" : "opacity-0"
            }`}
            autoPlay
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={() => onBackgroundLoadedMetadata(index)}
            onTimeUpdate={() => onBackgroundTimeUpdate(index)}
            onEnded={startBackgroundCrossfade}
          >
            <source src="/video/Kara_Delik.mp4" type="video/mp4" />
          </video>
        ))}
      </div>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {!isAnimationPaused
          ? warpStars.map((star) => (
              <motion.span
                key={star.id}
                className="absolute left-1/2 top-1/2 block h-[2px] w-[2px] rounded-full bg-white"
                animate={{
                  x: [0, star.x],
                  y: [0, star.y],
                  scale: [0.2, 1.2, 1.5],
                  opacity: [0, 0.9, 0],
                }}
                transition={{
                  duration: star.duration,
                  delay: star.delay,
                  ease: "easeOut",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            ))
          : null}
      </div>
      <div className="pointer-events-none fixed inset-0 z-0 bg-black/55" />

      <div className="relative z-10 w-full px-4 pb-28 md:px-8">
        <header className="relative mx-auto flex h-20 w-full items-center justify-between border-b border-white/10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#f4f4f4]">
            AKİYOM AI
          </div>
          <nav className="hidden items-center gap-6 text-sm text-[#a8a8a8] lg:absolute lg:left-1/2 lg:flex lg:-translate-x-[46%]">
            {headerItems[language].map((item) => (
              <a key={item} className="transition-colors hover:text-[#f5f5f5]" href="#">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAnimationPaused((prev) => !prev)}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-[#d4d7de] transition-all hover:border-white/25 hover:text-white"
            >
              {isAnimationPaused ? "Animasyonları Başlat" : "Animasyonları Durdur"}
            </button>
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
              <button
                onClick={() => setLanguage("tr")}
                className={`rounded-full px-2.5 py-1 text-[10px] transition ${
                  language === "tr" ? "bg-white/20 text-white" : "text-[#c6c8cf]"
                }`}
              >
                TR
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`rounded-full px-2.5 py-1 text-[10px] transition ${
                  language === "en" ? "bg-white/20 text-white" : "text-[#c6c8cf]"
                }`}
              >
                EN
              </button>
            </div>
            <button
              onClick={() => openAuth("login")}
              className="rounded-full border border-[#ffffff1a] bg-white/[0.02] px-3.5 py-2 text-xs text-[#ececec] transition-all hover:border-[#ffffff3d] hover:shadow-[0_0_26px_rgba(255,255,255,0.08)]"
            >
              {t.login}
            </button>
            <button
              onClick={() => openAuth("register")}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#9aa8ff66] bg-gradient-to-r from-[#8ca1ff24] to-[#b78dff24] px-4 py-2 text-xs text-[#f1f1f1] transition-all hover:border-[#c8ceff88] hover:shadow-[0_0_34px_rgba(136,158,255,0.24)]"
            >
              {t.startNow}
              <ArrowRight size={12} />
            </button>
          </div>
        </header>

        <section className="mx-auto w-full py-16 text-center md:py-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d5d5d5]">{t.heroEyebrow}</p>
          <h1 className="mx-auto mt-4 max-w-[12ch] text-[2.5rem] font-semibold leading-[0.96] tracking-[-0.045em] text-[#f5f5f5] sm:text-[3.1rem] md:text-[5.8rem]">
            {t.heroTitle1}
            <br />
            {t.heroTitle2}
          </h1>
          <p className="mx-auto mt-5 max-w-[76ch] text-[14px] leading-7 text-[#a3a3aa]">{t.heroDesc}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button className="rounded-full border border-[#9aa8ff66] bg-gradient-to-r from-[#8ca1ff1f] to-[#b78dff1f] px-5 py-2.5 text-sm text-[#f1f1f1] transition-all hover:border-[#c8ceff88] hover:shadow-[0_0_34px_rgba(136,158,255,0.24)]">
              {t.freeStart}
            </button>
            <button className="rounded-full border border-[#ffffff1a] bg-white/[0.015] px-5 py-2.5 text-sm text-[#ebebeb] transition-all hover:border-[#ffffff38] hover:shadow-[0_0_30px_rgba(255,255,255,0.07)]">
              {t.demo}
            </button>
          </div>
        </section>

        <section className="mx-auto w-full pb-20">
          <div className="mx-auto max-w-[1080px] rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md md:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#cfd2da]">AI ROUTER CHAT</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#f3f3f5] md:text-3xl">
                  Tek chatten yönlendir, doğru modeli otomatik seç
                </h3>
              </div>
              <span className="rounded-full border border-[#9aa8ff66] bg-[#8ca1ff1a] px-3 py-1 text-xs text-[#d8deff]">
                Niyet Analizi Aktif
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/35 p-3 md:p-4">
              <div className="max-h-[280px] space-y-3 overflow-y-auto pr-1">
                {routerChat.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`max-w-[92%] rounded-2xl border px-3 py-2 text-sm leading-6 md:max-w-[78%] ${
                      message.role === "user"
                        ? "ml-auto border-[#8ca1ff52] bg-[#8ca1ff1c] text-[#e7ebff]"
                        : "border-white/10 bg-white/[0.05] text-[#d9dce4]"
                    }`}
                  >
                    <p>{message.text}</p>
                    {message.intent ? (
                      <div className="mt-2 rounded-xl border border-white/10 bg-black/30 p-2.5 text-xs text-[#c8ccd8]">
                        <p>
                          <strong className="text-[#eef1ff]">Agent:</strong> {message.intent.agentName}
                        </p>
                        <p>
                          <strong className="text-[#eef1ff]">Modül:</strong> {message.intent.module}
                        </p>
                        <p>
                          <strong className="text-[#eef1ff]">Önerilen Model:</strong> {message.intent.model}
                        </p>
                        <p>
                          <strong className="text-[#eef1ff]">Öncelik:</strong> {message.intent.priority}
                        </p>
                        <p className="mt-1 text-[#adb3c4]">{message.intent.reason}</p>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              {routerStatuses.length ? (
                <div className="mt-3 rounded-xl border border-[#9aa8ff3b] bg-[#8ca1ff17] p-3 text-xs text-[#dce2ff]">
                  {routerStatuses.map((status, index) => (
                    <p key={`${status}-${index}`} className={index > 0 ? "mt-1.5" : ""}>
                      {status}
                    </p>
                  ))}
                </div>
              ) : null}

              <form onSubmit={onSubmitRouter} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <div className="flex w-full items-center gap-2 sm:max-w-max">
                  <button
                    type="button"
                    onClick={() => setRouterMode("auto")}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      routerMode === "auto"
                        ? "border-[#9aa8ff88] bg-[#8ca1ff26] text-[#e4e9ff]"
                        : "border-white/10 bg-white/[0.03] text-[#cfd2da]"
                    }`}
                  >
                    Auto
                  </button>
                  <button
                    type="button"
                    onClick={() => setRouterMode("manual")}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      routerMode === "manual"
                        ? "border-[#9aa8ff88] bg-[#8ca1ff26] text-[#e4e9ff]"
                        : "border-white/10 bg-white/[0.03] text-[#cfd2da]"
                    }`}
                  >
                    Manuel {hasManualAccess ? "" : "(Üyelik)"}
                  </button>
                </div>
              </form>

              {routerMode === "manual" ? (
                <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  {!hasManualAccess ? (
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openAuth("register")}
                        className="rounded-full border border-[#9aa8ff66] bg-[#8ca1ff20] px-3 py-1.5 text-xs text-[#e2e7ff] transition hover:border-[#c8ceff88]"
                      >
                        Üye Ol ve Manuel Aç
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-2 md:grid-cols-3">
                      <select
                        value={manualModule}
                        onChange={(event) => {
                          const moduleValue = event.target.value as ChatModule;
                          setManualModule(moduleValue);
                          setManualModel(manualModelsByModule[moduleValue][0]);
                        }}
                        className="h-10 rounded-full border border-white/10 bg-black/40 px-3 text-xs text-[#e9e9ef] outline-none"
                      >
                        {(["AI Video", "AI Image", "AI Text", "AI Sound"] as ChatModule[]).map((option) => (
                          <option key={option} value={option} className="bg-[#0a0a0a]">
                            {option}
                          </option>
                        ))}
                      </select>
                      <select
                        value={manualPriority}
                        onChange={(event) => setManualPriority(event.target.value as Priority)}
                        className="h-10 rounded-full border border-white/10 bg-black/40 px-3 text-xs text-[#e9e9ef] outline-none"
                      >
                        {(["Hız", "Maliyet", "Kalite-Denge"] as Priority[]).map((option) => (
                          <option key={option} value={option} className="bg-[#0a0a0a]">
                            {option}
                          </option>
                        ))}
                      </select>
                      <select
                        value={manualModel}
                        onChange={(event) => setManualModel(event.target.value)}
                        className="h-10 rounded-full border border-white/10 bg-black/40 px-3 text-xs text-[#e9e9ef] outline-none"
                      >
                        {manualModelsByModule[manualModule].map((option) => (
                          <option key={option} value={option} className="bg-[#0a0a0a]">
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ) : null}

              <form onSubmit={onSubmitRouter} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  value={routerInput}
                  onChange={(event) => setRouterInput(event.target.value)}
                  placeholder="Örn: Bana kırmızı bir araba çiz, hızlı ve uygun maliyetli olsun."
                  className="h-14 flex-1 rounded-[18px] border border-white/10 bg-black/40 px-5 text-base text-[#f2f2f5] outline-none placeholder:text-[#83858d] focus:border-[#9aa8ff66]"
                />
                <button
                  type="submit"
                  disabled={isRouterProcessing}
                  className="h-14 rounded-[18px] border border-[#9aa8ff66] bg-gradient-to-r from-[#8ca1ff24] to-[#b78dff24] px-7 text-base transition-all hover:border-[#c8ceff88] hover:shadow-[0_0_28px_rgba(136,158,255,0.22)]"
                >
                  {isRouterProcessing ? "İşleniyor..." : "Analiz Et ve Yönlendir"}
                </button>
              </form>

              <div className="mt-3 flex flex-wrap gap-2">
                {routerQuickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setRouterInput(prompt)}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[#d8dbe3] transition-all hover:border-white/20 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full pb-20">
          <div className="mx-auto max-w-[1180px] rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md md:p-7">
            <motion.div
              className="mx-auto max-w-[780px] text-center"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.p
                className="text-[11px] uppercase tracking-[0.18em] text-[#cfd2da]"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                {t.welcomeEyebrow}
              </motion.p>
              <motion.h2
                className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#f5f5f6] md:text-4xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.55 }}
                transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
                animate={isAnimationPaused ? { y: 0 } : { y: [0, -2, 0] }}
              >
                <motion.span
                  className="block"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.45, delay: 0.12 }}
                >
                  {t.welcomeTitle1}
                </motion.span>
                <motion.span
                  className="block"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.45, delay: 0.2 }}
                >
                  {t.welcomeTitle2}
                </motion.span>
              </motion.h2>
              <motion.p
                className="mt-4 text-sm leading-7 text-[#a7a8af] md:text-[15px]"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.6, delay: 0.28, ease: "easeOut" }}
                animate={isAnimationPaused ? { opacity: 1 } : { opacity: [0.88, 1, 0.88] }}
              >
                {t.welcomeDesc}
              </motion.p>
            </motion.div>

            <div className="mt-8">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {controlDeck.map(({ title, description, icon: Icon, preview }) => (
                  <article
                    key={title}
                    className="group rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition-all duration-300 hover:border-white/20 hover:shadow-[0_16px_36px_rgba(120,146,255,0.14)]"
                  >
                    {renderControlPreview(preview as "video" | "image" | "text" | "sound", title)}
                    <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06]">
                      <Icon size={16} />
                    </div>
                    <h3 className="text-base text-[#f2f2f4]">{title}</h3>

                    <div className="mt-2 grid transition-all duration-300 ease-out [grid-template-rows:0fr] group-hover:[grid-template-rows:1fr]">
                      <div className="overflow-hidden">
                        <p className="pt-2 text-sm leading-7 text-[#a4a5ad]">{description[language]}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto flex w-full justify-center pb-24">
          <div className="w-full max-w-[980px] rounded-[28px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-md md:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-3xl tracking-[-0.02em] text-[#f3f3f5]">{t.thinkTitle}</h2>
              <div className="flex gap-2">
                <button className="rounded-full border border-[#9aa8ff66] bg-gradient-to-r from-[#8ca1ff1f] to-[#b78dff1f] px-4 py-2 text-xs text-[#f1f1f1] transition-all hover:border-[#c8ceff88] hover:shadow-[0_0_24px_rgba(136,158,255,0.24)]">
                  {t.freeStart}
                </button>
                <button className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs text-[#ececf0] transition-all hover:border-white/20">
                  {t.demo}
                </button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {cards.map(({ title, text, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:border-white/20"
                >
                  <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05]">
                    <Icon size={14} />
                  </div>
                  <h3 className="text-sm text-[#f2f2f2]">{title}</h3>
                  <p className="mt-2 text-xs leading-6 text-[#9f9fa6]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full pb-24">
          <div className="grid gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-3xl border p-6 backdrop-blur-md ${
                  plan.highlighted
                    ? "border-[#9aa8ff66] bg-white/[0.07] shadow-[0_0_34px_rgba(136,158,255,0.18)]"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.14em] text-[#cfd2da]">{plan.name}</p>
                <p className="mt-2 text-4xl font-semibold tracking-[-0.03em]">
                  {plan.price}
                  <span className="ml-1 text-sm font-normal text-[#9fa3ac]">/ay</span>
                </p>
                <p className="mt-2 text-sm text-[#a7a8af]">
                  {plan.name === "Starter"
                    ? t.pricingStarterDesc
                    : plan.name === "Pro"
                    ? t.pricingProDesc
                    : t.pricingTeamDesc}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-[#d5d7de]">
                  {plan.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                <button className="mt-6 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs transition-all hover:border-white/25 hover:shadow-[0_0_20px_rgba(165,187,255,0.2)]">
                  {t.choosePlan}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full pb-24">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md md:p-8">
            <h3 className="text-center text-2xl font-semibold tracking-[-0.03em] text-[#f3f3f5] md:text-4xl">
              {t.referralTitle}
            </h3>
            <p className="mx-auto mt-3 max-w-[70ch] text-center text-sm leading-7 text-[#a7a8af]">
              {t.referralDesc}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-[#9aa8ff66] bg-gradient-to-r from-[#8ca1ff1a] to-[#b78dff1a] p-5">
                <p className="text-xs uppercase tracking-[0.15em] text-[#d7dbff]">{t.referralYouGet}</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#f4f6ff]">{t.referralReward}</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.15em] text-[#cfd2da]">{t.referralFriendGets}</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#f3f3f5]">{t.referralDiscount}</p>
              </article>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/35 p-4 md:p-5">
              <p className="text-xs text-[#b6b8c0]">{t.referralLinkLabel}</p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                  readOnly
                  value="https://akiyom.ai/invite/AKIYOM-2500"
                  className="h-11 flex-1 rounded-full border border-white/10 bg-black/40 px-4 text-sm text-[#f2f2f5] outline-none"
                />
                <button
                  type="button"
                  className="h-11 rounded-full border border-[#9aa8ff66] bg-gradient-to-r from-[#8ca1ff24] to-[#b78dff24] px-5 text-sm transition-all hover:border-[#c8ceff88] hover:shadow-[0_0_28px_rgba(136,158,255,0.22)]"
                >
                  {t.referralLinkAction}
                </button>
              </div>
            </div>

            <form onSubmit={onSubmitReferral} className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:p-5">
              <p className="text-sm text-[#dce0ea]">{t.referralInviteTitle}</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={referralEmail}
                  onChange={(e) => setReferralEmail(e.target.value)}
                  placeholder={t.referralInvitePlaceholder}
                  className="h-11 flex-1 rounded-full border border-white/10 bg-black/40 px-4 text-sm text-[#f2f2f5] outline-none placeholder:text-[#83858d] focus:border-[#9aa8ff66]"
                />
                <button
                  type="submit"
                  className="h-11 rounded-full border border-[#9aa8ff66] bg-gradient-to-r from-[#8ca1ff24] to-[#b78dff24] px-6 text-sm transition-all hover:border-[#c8ceff88] hover:shadow-[0_0_28px_rgba(136,158,255,0.22)]"
                >
                  {t.referralInviteButton}
                </button>
              </div>
              {isReferralSubmitted ? <p className="mt-3 text-xs text-[#cfd7ff]">{t.referralSuccess}</p> : null}
            </form>
          </div>
        </section>

        <section className="mx-auto w-full pb-24">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md md:p-8">
            <p className="text-center text-[11px] uppercase tracking-[0.18em] text-[#cfd2da]">{t.trustedBy}</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:gap-5">
              {trustLogos.map((logo) => (
                <span
                  key={logo}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs tracking-[0.12em] text-[#d7dae2]"
                >
                  {logo}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm leading-7 text-[#d7dae2]">
                  “AKİYOM AI ile içerik üretim süremizi %55 kısalttık. Video, metin
                  ve görsel ekipleri artık aynı panelde çalışıyor.”
                </p>
                <p className="mt-3 text-xs text-[#9ca0aa]">— Ece T., Creative Director</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm leading-7 text-[#d7dae2]">
                  “Tek bir akışta GPT + Claude + Midjourney kullanmak operasyonu
                  inanılmaz sadeleştirdi.”
                </p>
                <p className="mt-3 text-xs text-[#9ca0aa]">— Mert A., Growth Lead</p>
              </article>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full pb-28">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur-md md:p-10">
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#f3f3f5] md:text-4xl">
              {t.waitlistTitle}
            </h3>
            <p className="mx-auto mt-3 max-w-[62ch] text-sm leading-7 text-[#a7a8af]">
              {t.waitlistDesc}
            </p>
            <form
              onSubmit={onSubmitWaitlist}
              className="mx-auto mt-6 flex w-full max-w-[620px] flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.waitlistPlaceholder}
                className="h-11 flex-1 rounded-full border border-white/10 bg-black/40 px-4 text-sm text-[#f2f2f5] outline-none placeholder:text-[#83858d] focus:border-[#9aa8ff66]"
              />
              <button
                type="submit"
                className="h-11 rounded-full border border-[#9aa8ff66] bg-gradient-to-r from-[#8ca1ff24] to-[#b78dff24] px-6 text-sm transition-all hover:border-[#c8ceff88] hover:shadow-[0_0_28px_rgba(136,158,255,0.22)]"
              >
                {t.waitlistBtn}
              </button>
            </form>
            {isSubmitted ? (
              <p className="mt-3 text-xs text-[#cfd7ff]">
                {t.waitlistSuccess}
              </p>
            ) : null}
          </div>
        </section>

        <section id="models" className="mx-auto w-full pb-24">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Sora video ve storyboard üretiminde yeni standart.",
              "Claude ve GPT ile derin araştırma + karar belgeleri.",
              "Gemini ile multimodal akışlar ve yüksek hız.",
            ].map((text, idx) => (
              <article
                key={text}
                className="min-h-28 rounded-[999px] border border-white/10 bg-white/[0.05] px-7 py-6 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_28px_rgba(176,199,255,0.16)]"
              >
                <div className="mb-2 flex items-center gap-2 text-xs text-[#d8d8df]">
                  <Sparkles size={12} />
                  Feature {idx + 1}
                </div>
                <p className="text-sm leading-7 text-[#a7a7af]">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center px-4 md:px-8">
          <motion.div
            className="pointer-events-auto w-full rounded-[999px] border border-white/10 bg-white/[0.07] px-5 py-3 backdrop-blur-xl"
            animate={
              isAnimationPaused
                ? { y: 0, scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" }
                : {
                    y: [0, -4, 0],
                    scale: [1, 1.01, 1],
                    boxShadow: [
                      "0 0 0 rgba(0,0,0,0)",
                      "0 0 36px rgba(158,179,255,0.14)",
                      "0 0 0 rgba(0,0,0,0)",
                    ],
                  }
            }
            transition={{ duration: 8, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#e1e1e8] md:text-xs">
              {apiItems.map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5">
                    <CircleDot size={11} className="text-[#cfd7ff]" />
                    {item}
                  </span>
                  {index < apiItems.length - 1 ? (
                    <span className="text-[#777780]">|</span>
                  ) : null}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {isAuthModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            aria-label="Close auth modal"
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            onClick={() => setIsAuthModalOpen(false)}
          />
          <div className="relative w-full max-w-[760px] rounded-3xl border border-white/10 bg-[#050505]/95 p-6 backdrop-blur-md md:p-8">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-[#d6d8df] hover:border-white/20"
            >
              ✕
            </button>

            <p className="text-center text-[11px] uppercase tracking-[0.18em] text-[#cfd2da]">
              {t.authEyebrow}
            </p>
            <h3 className="mt-3 text-center text-2xl font-semibold tracking-[-0.03em] text-[#f3f3f5] md:text-4xl">
              {t.authTitle}
            </h3>
            <p className="mx-auto mt-3 max-w-[62ch] text-center text-sm leading-7 text-[#a7a8af]">
              {t.authDesc}
            </p>

            <div className="mx-auto mt-6 flex w-full max-w-[320px] items-center justify-center rounded-full border border-white/10 bg-black/40 p-1">
              <button
                onClick={() => {
                  setAuthMode("login");
                  setAuthDone(false);
                }}
                className={`flex-1 rounded-full px-4 py-2 text-xs transition ${
                  authMode === "login" ? "bg-white/20 text-white" : "text-[#c6c8cf]"
                }`}
              >
                {t.loginTab}
              </button>
              <button
                onClick={() => {
                  setAuthMode("register");
                  setAuthDone(false);
                }}
                className={`flex-1 rounded-full px-4 py-2 text-xs transition ${
                  authMode === "register" ? "bg-white/20 text-white" : "text-[#c6c8cf]"
                }`}
              >
                {t.registerTab}
              </button>
            </div>

            <form onSubmit={onSubmitAuth} className="mx-auto mt-6 max-w-[520px] space-y-3">
              {authMode === "register" ? (
                <label className="block">
                  <span className="mb-1.5 block text-xs text-[#b6b8c0]">{t.nameLabel}</span>
                  <input
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="h-11 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-[#f2f2f5] outline-none placeholder:text-[#83858d] focus:border-[#9aa8ff66]"
                    placeholder={t.nameLabel}
                  />
                </label>
              ) : null}

              <label className="block">
                <span className="mb-1.5 block text-xs text-[#b6b8c0]">{t.emailLabel}</span>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="h-11 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-[#f2f2f5] outline-none placeholder:text-[#83858d] focus:border-[#9aa8ff66]"
                  placeholder={t.waitlistPlaceholder}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs text-[#b6b8c0]">{t.passwordLabel}</span>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="h-11 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-[#f2f2f5] outline-none placeholder:text-[#83858d] focus:border-[#9aa8ff66]"
                  placeholder="••••••••"
                />
              </label>
              {authMode === "login" ? (
                <button
                  type="button"
                  className="ml-auto block text-xs text-[#9ea8d8] transition-colors hover:text-[#c7d0ff]"
                >
                  {t.forgotPassword}
                </button>
              ) : null}

              <button
                type="submit"
                className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#9aa8ff66] bg-gradient-to-r from-[#8ca1ff24] to-[#b78dff24] text-sm transition-all hover:border-[#c8ceff88] hover:shadow-[0_0_28px_rgba(136,158,255,0.22)]"
              >
                {authMode === "login" ? <LockKeyhole size={15} /> : <UserPlus size={15} />}
                {authMode === "login" ? t.loginAction : t.registerAction}
              </button>
            </form>

            {authDone ? (
              <p className="mt-3 text-center text-xs text-[#cfd7ff]">
                {authMode === "login" ? t.authSuccessLogin : t.authSuccessRegister}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
