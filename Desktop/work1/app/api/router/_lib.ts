export type ChatModule = "AI Video" | "AI Image" | "AI Text" | "AI Sound";
export type Priority = "Hız" | "Maliyet" | "Kalite-Denge";

export const detectIntentFromPrompt = (
  prompt: string
): { module: ChatModule; priority: Priority; requestType: string; isChatOnly: boolean } => {
  const normalized = prompt.toLocaleLowerCase("tr-TR");

  const isSpeed = /(hızlı|hizli|çabuk|acil|hemen|saniye)/.test(normalized);
  const isCost = /(ucuz|bütçe|butce|ekonomik|maliyet)/.test(normalized);
  const isHighQuality = /(kalite|premium|detay|gerçekçi|gercekci|profesyonel|pro)/.test(normalized);
  const hasGenerationIntent =
    /(çiz|ciz|üret|uret|oluştur|olustur|yaz|yazar mısın|video|görsel|gorsel|müzik|muzik|ses|voiceover|script|senaryo|afiş|afis|poster|logo|render)/.test(
      normalized
    );
  const isConversationalPrompt =
    /(selam|merhaba|nasılsın|nasilsin|ne düşünüyorsun|ne dusunuyorsun|yardım et|yardim et|sence|açıkla|acikla)/.test(
      normalized
    );

  let module: ChatModule = "AI Text";
  if (/(video|reel|shorts|animasyon|sahne|montaj)/.test(normalized)) module = "AI Video";
  else if (/(çiz|ciz|görsel|gorsel|image|foto|afiş|afis|logo|poster|render)/.test(normalized)) module = "AI Image";
  else if (/(ses|müzik|muzik|voice|voiceover|sound|beat|mix|master)/.test(normalized)) module = "AI Sound";
  else if (/(metin|yaz|mail|blog|senaryo|script|özet|ozet|chat)/.test(normalized)) module = "AI Text";

  let priority: Priority = "Kalite-Denge";
  if (isCost) priority = "Maliyet";
  else if (isSpeed) priority = "Hız";
  else if (isHighQuality) priority = "Kalite-Denge";

  return {
    module,
    priority,
    requestType: module === "AI Text" && isConversationalPrompt && !hasGenerationIntent ? "Chat" : module.replace("AI ", ""),
    isChatOnly: module === "AI Text" && isConversationalPrompt && !hasGenerationIntent,
  };
};

export const getAgentSelection = (module: ChatModule, priority: Priority) => {
  const agentsByModule: Record<ChatModule, string> = {
    "AI Video": "VideoForge Agent",
    "AI Image": "PixelCraft Agent",
    "AI Text": "ScriptFlow Agent",
    "AI Sound": "WaveMind Agent",
  };

  const modelByModule: Record<ChatModule, Record<Priority, string>> = {
    "AI Video": {
      Hız: "Runway Gen-3 Turbo",
      Maliyet: "Luma Dream Machine Lite",
      "Kalite-Denge": "Sora",
    },
    "AI Image": {
      Hız: "FLUX Schnell",
      Maliyet: "SDXL Turbo",
      "Kalite-Denge": "Midjourney v6",
    },
    "AI Text": {
      Hız: "Gemini Flash",
      Maliyet: "GPT-4.1 mini",
      "Kalite-Denge": "Claude 3.5 Sonnet",
    },
    "AI Sound": {
      Hız: "Suno Fast",
      Maliyet: "Udio Standard",
      "Kalite-Denge": "Suno v4",
    },
  };

  const reasonByPriority: Record<Priority, string> = {
    Hız: "Öncelik hız olduğu için düşük gecikmeli model seçildi.",
    Maliyet: "Öncelik bütçe olduğu için kredi tüketimi düşük model seçildi.",
    "Kalite-Denge": "Daha iyi çıktı kalitesi için premium/denge modeline yönlendirildi.",
  };

  return {
    agentName: agentsByModule[module],
    model: modelByModule[module][priority],
    reason: reasonByPriority[priority],
  };
};
