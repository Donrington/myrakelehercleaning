import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/components";
import BookingConfirmation from "@/emails/BookingConfirmation";

const NOTIFY_EMAIL = "myrakyle2580@gmail.com";
const BASE_URL     = process.env.NEXT_PUBLIC_BASE_URL ?? "https://myrakelehercleaning.com";

// Map form values to readable labels
const SERVICE_LABELS: Record<string, string> = {
  "sanctuary-restoration":   "Sanctuary Restoration",
  "post-construction":       "Post Construction Cleaning",
  "fumigation-pest-control": "Fumigation & Pest Control",
  "residential-office":      "Residential / Office Cleaning",
  "deep-cleaning":           "Deep Cleaning",
  "carpet-cleaning":         "Carpet Cleaning",
  "move-in-out":             "Move-In / Move-Out",
  "others":                  "Others / General Enquiry",
};

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Initialise Resend inside the handler — avoids build-time missing key error
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { name, contact, service, details } = await req.json();

    if (!name || !contact || !service) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const serviceLabel = SERVICE_LABELS[service] ?? service;
    const submittedAt  = new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

    // ── Render confirmation template ───────────────────────────────────────
    const confirmationHtml = await render(
      BookingConfirmation({
        clientName:  name,
        service:     serviceLabel,
        contact,
        details:     details || undefined,
        submittedAt,
        baseUrl:     BASE_URL,
      })
    );

    // ── Internal notification (styled table) ──────────────────────────────
    const notificationHtml = `
      <div style="font-family:monospace;background:#050505;color:#f2f2f2;padding:32px;border-radius:12px;max-width:600px;margin:0 auto;">
        <p style="color:#55A53B;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 16px;">● New Booking Request</p>
        <h2 style="font-size:22px;font-weight:800;margin:0 0 24px;letter-spacing:-0.02em;">New Enquiry Received</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#555;font-size:11px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-transform:uppercase;letter-spacing:0.1em;">Name</td>
              <td style="color:#f2f2f2;font-size:13px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">${name}</td></tr>
          <tr><td style="color:#555;font-size:11px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-transform:uppercase;letter-spacing:0.1em;">Contact</td>
              <td style="color:#f2f2f2;font-size:13px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">${contact}</td></tr>
          <tr><td style="color:#555;font-size:11px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-transform:uppercase;letter-spacing:0.1em;">Service</td>
              <td style="color:#55A53B;font-size:13px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:700;">${serviceLabel}</td></tr>
          <tr><td style="color:#555;font-size:11px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-transform:uppercase;letter-spacing:0.1em;">Date</td>
              <td style="color:#f2f2f2;font-size:13px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">${submittedAt}</td></tr>
          <tr><td style="color:#555;font-size:11px;padding:10px 0;text-transform:uppercase;letter-spacing:0.1em;vertical-align:top;">Notes</td>
              <td style="color:#a0a0a0;font-size:12px;padding:10px 0;line-height:1.5;">${details || "—"}</td></tr>
        </table>
      </div>
    `;

    // ── 1. Notify business owner ───────────────────────────────────────────
    await resend.emails.send({
      from:    "Myra Keleher Booking <onboarding@resend.dev>",
      to:      [NOTIFY_EMAIL],
      subject: `New Booking Request — ${serviceLabel} from ${name}`,
      html:    notificationHtml,
    });

    // ── 2. Confirmation to client (only if contact is an email) ───────────
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    if (isEmail) {
      await resend.emails.send({
        from:    "Myra Keleher <onboarding@resend.dev>",
        to:      [contact],
        subject: "Booking Confirmed — Myra Keleher Cleaning Agency",
        html:    confirmationHtml,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/send] error:", err);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }
}
