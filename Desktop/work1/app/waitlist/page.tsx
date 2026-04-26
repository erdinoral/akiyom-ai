"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

const waitlistStars = Array.from({ length: 72 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 72;
  const x = Math.cos(angle) * (680 + (i % 7) * 75);
  const y = Math.sin(angle) * (380 + (i % 5) * 70);
  return {
    id: i,
    x,
    y,
    delay: (i % 12) * 0.14,
    duration: 2.6 + (i % 5) * 0.3,
  };
});

const welcomeSlides = [
  {
    title: "🌌 Akiyom AI: Zekanın Yeni Olay Ufku",
    description:
      "Sıradan AI araçlarının karmaşasından kurtulun. Akiyom AI, evrendeki en güçlü modelleri tek bir yerçekimi merkezinde topluyor. Waitlist'e katılarak bu elit ekosisteme ilk adımı atanlardan olun.",
  },
  {
    title: "Zeka Navigasyonu (Axiom Core)",
    description:
      "Siz ne istediğinizi söyleyin, biz sizin için niyetinizi analiz edelim ve en doğru AI modeline (GPT-5, Claude 3.5, Gemini Pro) saniyeler içinde bağlayalım.",
  },
  {
    title: "Multimodal Senfoni",
    description:
      "Video, Görsel, Metin ve Ses... Artık sekmeler arasında kaybolmak yok. Tüm üretim süreçlerinizi tek bir premium panelden, birbirine entegre şekilde yönetin.",
  },
  {
    title: "Akıllı Verimlilik (Auto-Mode)",
    description:
      "Hız ve maliyet dengesini Akiyom'a bırakın. Pro üyeler için dizginler tamamen sizin elinizde; her modelin gücünü manuel olarak kontrol edin.",
  },
  {
    title: "Canlı Süreç Takibi",
    description:
      "Üretiminizin her saniyesini canlı status mesajlarıyla izleyin. Yapay zekanın o an ne düşündüğünü ve ne ürettiğini anbean görün.",
  },
];
const promoSlides = [
  "🎁 Açılışa özel: Waitlist'e katılan herkese başlangıç kredi hediyesi tanımlanacak.",
  "🤝 Arkadaşını davet et, ekstra kredi kazan: Her başarılı davette bonus kredi hesabına yüklenecek.",
];

export default function WaitlistPage() {
  const searchParams = useSearchParams();
  const backgroundVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const crossfadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualSlideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeBackgroundVideo, setActiveBackgroundVideo] = useState(0);
  const [isBackgroundCrossfading, setIsBackgroundCrossfading] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isSlideAutoPlayEnabled, setIsSlideAutoPlayEnabled] = useState(true);
  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [signupBonusCredits, setSignupBonusCredits] = useState<number | null>(null);
  const [yourReferralCode, setYourReferralCode] = useState("");
  const [inviterBonusAwarded, setInviterBonusAwarded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isSlideAutoPlayEnabled) return;

    const slideLoop = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % welcomeSlides.length);
    }, 4200);

    return () => clearInterval(slideLoop);
  }, [isSlideAutoPlayEnabled]);

  useEffect(() => {
    const promoLoop = setInterval(() => {
      setActivePromoIndex((prev) => (prev + 1) % promoSlides.length);
    }, 3800);

    return () => clearInterval(promoLoop);
  }, []);

  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) {
      setInviteCode(refFromUrl.toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    const firstVideo = backgroundVideoRefs.current[0];
    if (firstVideo) void firstVideo.play();

    return () => {
      if (crossfadeTimeoutRef.current) clearTimeout(crossfadeTimeoutRef.current);
      if (manualSlideTimeoutRef.current) clearTimeout(manualSlideTimeoutRef.current);
    };
  }, []);

  const startBackgroundCrossfade = () => {
    if (isBackgroundCrossfading) return;
    const currentIndex = activeBackgroundVideo;
    const nextIndex = currentIndex === 0 ? 1 : 0;
    const currentVideo = backgroundVideoRefs.current[currentIndex];
    const nextVideo = backgroundVideoRefs.current[nextIndex];
    if (!currentVideo || !nextVideo) return;

    setIsBackgroundCrossfading(true);
    nextVideo.currentTime = 0;
    void nextVideo.play();
    setActiveBackgroundVideo(nextIndex);

    if (crossfadeTimeoutRef.current) clearTimeout(crossfadeTimeoutRef.current);
    crossfadeTimeoutRef.current = setTimeout(() => {
      currentVideo.pause();
      currentVideo.currentTime = 0;
      setIsBackgroundCrossfading(false);
    }, 850);
  };

  const onBackgroundTimeUpdate = (index: number) => {
    if (index !== activeBackgroundVideo) return;
    const currentVideo = backgroundVideoRefs.current[index];
    if (!currentVideo || !Number.isFinite(currentVideo.duration)) return;
    if (currentVideo.currentTime >= currentVideo.duration - 0.85) {
      startBackgroundCrossfade();
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setSubmitted(false);
    setSubmitError(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, inviteCode }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setSubmitError(payload.error ?? "Kayıt sırasında bir hata oluştu.");
        setIsSubmitting(false);
        return;
      }

      const payload = (await response.json()) as {
        signupBonusCredits?: number;
        yourReferralCode?: string;
        inviterBonusAwarded?: boolean;
      };
      setSubmitted(true);
      setEmail("");
      setInviteCode("");
      setSignupBonusCredits(payload.signupBonusCredits ?? null);
      setYourReferralCode(payload.yourReferralCode ?? "");
      setInviterBonusAwarded(Boolean(payload.inviterBonusAwarded));
      setIsSubmitting(false);
    } catch {
      setSubmitError("Bağlantı hatası oluştu. Lütfen tekrar dene.");
      setIsSubmitting(false);
    }
  };

  const onManualSlideSelect = (index: number) => {
    setActiveSlideIndex(index);
    setIsSlideAutoPlayEnabled(false);

    if (manualSlideTimeoutRef.current) {
      clearTimeout(manualSlideTimeoutRef.current);
    }

    manualSlideTimeoutRef.current = setTimeout(() => {
      setIsSlideAutoPlayEnabled(true);
    }, 7000);
  };

  const inviteLink =
    yourReferralCode && typeof window !== "undefined"
      ? `${window.location.origin}/waitlist?ref=${encodeURIComponent(yourReferralCode)}`
      : "";

  const onCopyInviteLink = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setSubmitError("Davet linki kopyalanamadı. Elle kopyalayabilirsin.");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 text-[#F5F5F5]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {[0, 1].map((index) => (
          <video
            key={index}
            ref={(element) => {
              backgroundVideoRefs.current[index] = element;
            }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              activeBackgroundVideo === index ? "opacity-30" : "opacity-0"
            }`}
            autoPlay
            muted
            playsInline
            preload="auto"
            onTimeUpdate={() => onBackgroundTimeUpdate(index)}
            onEnded={startBackgroundCrossfade}
          >
            <source src="/video/Kara_Delik.mp4" type="video/mp4" />
          </video>
        ))}
      </div>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {waitlistStars.map((star) => (
          <motion.span
            key={star.id}
            className="absolute left-1/2 top-1/2 block h-[2px] w-[2px] rounded-full bg-white"
            animate={{
              x: [0, star.x],
              y: [0, star.y],
              scale: [0.2, 1.15, 1.5],
              opacity: [0, 0.9, 0],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              ease: "easeOut",
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 bg-black/52" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(140,161,255,0.22),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(183,141,255,0.2),transparent_38%)]" />
      <section className="relative z-10 w-full max-w-[680px] rounded-3xl border border-white/10 bg-white/[0.05] p-6 text-center backdrop-blur-md md:p-9">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#cfd2da]">AKIYOM AI</p>
        <div className="relative mt-3 min-h-[186px] overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-4 md:p-5">
          <motion.div
            key={activeSlideIndex}
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 p-4 md:p-5"
          >
            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#f5f5f6] md:text-3xl">
              {welcomeSlides[activeSlideIndex].title}
            </h1>
            <p className="mx-auto mt-3 max-w-[56ch] text-sm leading-7 text-[#a8abb3] md:text-base">
              {welcomeSlides[activeSlideIndex].description}
            </p>
          </motion.div>
        </div>

        <div className="mt-4 flex justify-center gap-1.5">
          {welcomeSlides.map((_, index) => (
            <button
              key={`slide-dot-${index}`}
              type="button"
              onClick={() => onManualSlideSelect(index)}
              aria-label={`Slayt ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                activeSlideIndex === index ? "w-6 bg-[#cfd7ff]" : "w-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        <form onSubmit={onSubmit} className="mx-auto mt-7 flex w-full max-w-[560px] flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ornek@email.com"
            className="h-12 flex-1 rounded-[16px] border border-white/10 bg-black/45 px-4 text-sm text-[#f2f2f5] outline-none placeholder:text-[#7f828b] focus:border-[#9aa8ff66]"
          />
          <input
            type="text"
            value={inviteCode}
            onChange={(event) => setInviteCode(event.target.value.toUpperCase())}
            placeholder="Davet kodu (opsiyonel) - AKIYOM-XXXXXX"
            className="h-12 flex-1 rounded-[16px] border border-white/10 bg-black/45 px-4 text-sm text-[#f2f2f5] outline-none placeholder:text-[#7f828b] focus:border-[#9aa8ff66]"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-[16px] border border-[#9aa8ff66] bg-gradient-to-r from-[#8ca1ff24] to-[#b78dff24] px-6 text-sm transition-all hover:border-[#c8ceff88] hover:shadow-[0_0_28px_rgba(136,158,255,0.22)] disabled:cursor-not-allowed disabled:opacity-70 sm:self-end"
          >
            {isSubmitting ? "Kaydediliyor..." : "Waitlist'e Katıl"}
          </button>
        </form>

        {submitted ? (
          <div className="mt-3 rounded-xl border border-[#9aa8ff45] bg-[#8ca1ff17] p-3 text-left text-xs text-[#d8deff]">
            <p>Kaydın alındı. Açılışta sana haber vereceğiz.</p>
            {signupBonusCredits ? <p className="mt-1">Hesabına {signupBonusCredits} başlangıç kredisi tanımlandı.</p> : null}
            {yourReferralCode ? <p className="mt-1">Davet kodun: {yourReferralCode}</p> : null}
            {inviterBonusAwarded ? <p className="mt-1">Davet eden kullanıcıya ekstra kredi bonusu işlendi.</p> : null}
            {inviteLink ? (
              <div className="mt-2 rounded-lg border border-white/10 bg-black/35 p-2">
                <p className="mb-1 text-[11px] text-[#aeb4c8]">Davet linkin</p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    readOnly
                    value={inviteLink}
                    className="h-9 flex-1 rounded-md border border-white/10 bg-black/45 px-2 text-[11px] text-[#eef1ff] outline-none"
                  />
                  <button
                    type="button"
                    onClick={onCopyInviteLink}
                    className="h-9 rounded-md border border-[#9aa8ff66] bg-[#8ca1ff20] px-3 text-[11px] text-[#e2e7ff] transition hover:border-[#c8ceff88]"
                  >
                    {copied ? "Kopyalandı" : "Linki Kopyala"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        {submitError ? <p className="mt-3 text-xs text-[#ffb4b4]">{submitError}</p> : null}

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#9aa8ff45] bg-[#8ca1ff14] p-3 text-left md:p-4">
          <motion.p
            key={activePromoIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="text-sm leading-6 text-[#e1e7ff]"
          >
            {promoSlides[activePromoIndex]}
          </motion.p>
        </div>
      </section>
    </main>
  );
}
