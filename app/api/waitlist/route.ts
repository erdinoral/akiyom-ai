import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SIGNUP_BONUS_CREDITS = 200;
const REFERRAL_BONUS_CREDITS = 100;

const makeReferralCode = () => `AKIYOM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; inviteCode?: string };
    const email = body.email?.trim().toLowerCase();
    const inviteCode = body.inviteCode?.trim().toUpperCase() || null;

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Geçerli bir e-posta adresi girin." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    let inviterRow: { id: number } | null = null;
    if (inviteCode) {
      const inviterLookup = await supabase
        .from("waitlist_entries")
        .select("id")
        .eq("referral_code", inviteCode)
        .single();
      inviterRow = inviterLookup.data ?? null;
    }

    let referralCode = "";
    for (let i = 0; i < 5; i += 1) {
      const candidate = makeReferralCode();
      const existing = await supabase
        .from("waitlist_entries")
        .select("id")
        .eq("referral_code", candidate)
        .maybeSingle();
      if (!existing.data) {
        referralCode = candidate;
        break;
      }
    }

    if (!referralCode) {
      return NextResponse.json({ error: "Davet kodu oluşturulamadı. Tekrar deneyin." }, { status: 500 });
    }

    const { error } = await supabase.from("waitlist_entries").insert({
      email,
      referral_code: referralCode,
      invited_by_code: inviteCode,
      signup_bonus_credits: SIGNUP_BONUS_CREDITS,
      referral_bonus_credits: 0,
      referral_count: 0,
      total_credits: SIGNUP_BONUS_CREDITS,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Bu e-posta zaten waitlist'te kayıtlı." }, { status: 409 });
      }
      return NextResponse.json(
        { error: `Kayıt sırasında hata: ${error.message}`, code: error.code },
        { status: 500 }
      );
    }

    let inviterBonusAwarded = false;
    if (inviterRow) {
      const inviterCredits = await supabase
        .from("waitlist_entries")
        .select("referral_bonus_credits, referral_count, total_credits")
        .eq("id", inviterRow.id)
        .single();

      if (inviterCredits.data) {
        const { referral_bonus_credits, referral_count, total_credits } = inviterCredits.data;
        const updateResult = await supabase
          .from("waitlist_entries")
          .update({
            referral_bonus_credits: (referral_bonus_credits ?? 0) + REFERRAL_BONUS_CREDITS,
            referral_count: (referral_count ?? 0) + 1,
            total_credits: (total_credits ?? 0) + REFERRAL_BONUS_CREDITS,
          })
          .eq("id", inviterRow.id);
        inviterBonusAwarded = !updateResult.error;
      }
    }

    return NextResponse.json({
      ok: true,
      signupBonusCredits: SIGNUP_BONUS_CREDITS,
      yourReferralCode: referralCode,
      inviterBonusAwarded,
      inviterBonusCredits: inviterBonusAwarded ? REFERRAL_BONUS_CREDITS : 0,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bilinmeyen sunucu hatası.";
    return NextResponse.json({ error: `Sunucu hatası: ${message}` }, { status: 500 });
  }
}
