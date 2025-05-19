import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCustomEmail({ to, subject, html }) {
  try {
    await resend.emails.send({
      from: "LionLease <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
    console.log("📩 Custom email sent to:", to);
  } catch (error) {
    console.error("❌ Email send failed:", error);
  }
}
