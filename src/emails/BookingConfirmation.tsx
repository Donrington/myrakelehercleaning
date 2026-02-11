import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface BookingConfirmationProps {
  clientName: string;
  service: string;
  contact: string;
  details?: string;
  submittedAt?: string;
  baseUrl?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Brand tokens
// ─────────────────────────────────────────────────────────────────────────────
const GREEN = "#55A53B";
const BG    = "#050505";
const CARD  = "#0f0f0f";
const BORDER = "rgba(255,255,255,0.08)";

// ─────────────────────────────────────────────────────────────────────────────
// Email Template
// ─────────────────────────────────────────────────────────────────────────────
export default function BookingConfirmation({
  clientName   = "Valued Client",
  service      = "Deep Cleaning",
  contact      = "—",
  details      = "No additional details provided.",
  submittedAt  = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  baseUrl      = "https://myrakeleher.com",
}: BookingConfirmationProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Booking Confirmed — Myra Keleher Cleaning Agency</Preview>

      <Tailwind
        config={{
          theme: {
            extend: {
              colors: { green: GREEN, bg: BG, card: CARD },
            },
          },
        }}
      >
        <Body style={{ backgroundColor: BG, margin: "0", padding: "0", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>

          {/* ── Outer wrapper ── */}
          <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>

            {/* ── Logo ── */}
            <Section style={{ textAlign: "center", paddingBottom: "24px" }}>
              <Img
                src={`${baseUrl}/images/logo.png`}
                alt="Myra Keleher"
                width="140"
                height="auto"
                style={{ margin: "0 auto", display: "block" }}
              />
            </Section>

            {/* ── Status bar (green line) ── */}
            <Hr style={{ borderColor: GREEN, borderWidth: "1.5px", margin: "0 0 32px 0" }} />

            {/* ── Main card ── */}
            <Section
              style={{
                backgroundColor: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: "16px",
                padding: "40px 36px",
              }}
            >
              {/* Protocol badge */}
              <Text
                style={{
                  color: GREEN,
                  fontSize: "10px",
                  fontFamily: "ui-monospace, monospace",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  margin: "0 0 12px 0",
                }}
              >
                ● Protocol Initiated
              </Text>

              {/* Headline */}
              <Heading
                style={{
                  color: "#f2f2f2",
                  fontSize: "28px",
                  fontWeight: "800",
                  letterSpacing: "-0.03em",
                  margin: "0 0 8px 0",
                  lineHeight: "1.2",
                }}
              >
                BOOKING CONFIRMED
              </Heading>

              {/* Subtext */}
              <Text style={{ color: "#a0a0a0", fontSize: "14px", lineHeight: "1.6", margin: "0 0 32px 0" }}>
                Hello {clientName}, your service request has been logged within our system.
                Our team will reach out within 24 hours to confirm your appointment details.
              </Text>

              {/* ── Data receipt box ── */}
              <Section
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1px solid ${BORDER}`,
                  borderRadius: "12px",
                  padding: "24px",
                  marginBottom: "32px",
                }}
              >
                <Text
                  style={{
                    color: "#555",
                    fontSize: "9px",
                    fontFamily: "ui-monospace, monospace",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    margin: "0 0 16px 0",
                  }}
                >
                  Booking Receipt
                </Text>

                {/* Service */}
                <Row style={{ marginBottom: "12px" }}>
                  <Column style={{ width: "40%" }}>
                    <Text style={{ color: "#555", fontSize: "11px", fontFamily: "ui-monospace, monospace", letterSpacing: "0.1em", margin: "0", textTransform: "uppercase" }}>
                      Service
                    </Text>
                  </Column>
                  <Column>
                    <Text style={{ color: "#f2f2f2", fontSize: "13px", fontFamily: "ui-monospace, monospace", margin: "0" }}>
                      {service}
                    </Text>
                  </Column>
                </Row>

                <Hr style={{ borderColor: "rgba(255,255,255,0.06)", margin: "8px 0" }} />

                {/* Contact */}
                <Row style={{ marginBottom: "12px", marginTop: "12px" }}>
                  <Column style={{ width: "40%" }}>
                    <Text style={{ color: "#555", fontSize: "11px", fontFamily: "ui-monospace, monospace", letterSpacing: "0.1em", margin: "0", textTransform: "uppercase" }}>
                      Contact
                    </Text>
                  </Column>
                  <Column>
                    <Text style={{ color: "#f2f2f2", fontSize: "13px", fontFamily: "ui-monospace, monospace", margin: "0" }}>
                      {contact}
                    </Text>
                  </Column>
                </Row>

                <Hr style={{ borderColor: "rgba(255,255,255,0.06)", margin: "8px 0" }} />

                {/* Date */}
                <Row style={{ marginBottom: "12px", marginTop: "12px" }}>
                  <Column style={{ width: "40%" }}>
                    <Text style={{ color: "#555", fontSize: "11px", fontFamily: "ui-monospace, monospace", letterSpacing: "0.1em", margin: "0", textTransform: "uppercase" }}>
                      Submitted
                    </Text>
                  </Column>
                  <Column>
                    <Text style={{ color: "#f2f2f2", fontSize: "13px", fontFamily: "ui-monospace, monospace", margin: "0" }}>
                      {submittedAt}
                    </Text>
                  </Column>
                </Row>

                <Hr style={{ borderColor: "rgba(255,255,255,0.06)", margin: "8px 0" }} />

                {/* Status */}
                <Row style={{ marginTop: "12px" }}>
                  <Column style={{ width: "40%" }}>
                    <Text style={{ color: "#555", fontSize: "11px", fontFamily: "ui-monospace, monospace", letterSpacing: "0.1em", margin: "0", textTransform: "uppercase" }}>
                      Status
                    </Text>
                  </Column>
                  <Column>
                    <Text style={{ color: GREEN, fontSize: "13px", fontFamily: "ui-monospace, monospace", fontWeight: "700", margin: "0" }}>
                      ● Processing
                    </Text>
                  </Column>
                </Row>

                {/* Details (if provided) */}
                {details && details !== "No additional details provided." && (
                  <>
                    <Hr style={{ borderColor: "rgba(255,255,255,0.06)", margin: "8px 0" }} />
                    <Row style={{ marginTop: "12px" }}>
                      <Column style={{ width: "40%" }}>
                        <Text style={{ color: "#555", fontSize: "11px", fontFamily: "ui-monospace, monospace", letterSpacing: "0.1em", margin: "0", textTransform: "uppercase" }}>
                          Notes
                        </Text>
                      </Column>
                      <Column>
                        <Text style={{ color: "#a0a0a0", fontSize: "12px", fontFamily: "ui-monospace, monospace", margin: "0", lineHeight: "1.5" }}>
                          {details}
                        </Text>
                      </Column>
                    </Row>
                  </>
                )}
              </Section>

              {/* ── CTA Button ── */}
              <Section style={{ textAlign: "center", marginBottom: "32px" }}>
                <Link
                  href={baseUrl}
                  style={{
                    backgroundColor: GREEN,
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "700",
                    fontFamily: "ui-monospace, monospace",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    padding: "14px 32px",
                    borderRadius: "9999px",
                    display: "inline-block",
                  }}
                >
                  VIEW BOOKING STATUS
                </Link>
              </Section>

              {/* Assurance note */}
              <Text style={{ color: "#555", fontSize: "12px", lineHeight: "1.6", margin: "0", textAlign: "center" }}>
                Questions? Reply to this email or reach us directly. We will never keep you waiting.
              </Text>
            </Section>

            {/* ── Footer ── */}
            <Section style={{ textAlign: "center", padding: "32px 0 0 0" }}>
              <Hr style={{ borderColor: "rgba(255,255,255,0.06)", margin: "0 0 20px 0" }} />

              <Text style={{ color: "#3a3a3a", fontSize: "11px", fontFamily: "ui-monospace, monospace", letterSpacing: "0.15em", margin: "0 0 10px 0" }}>
                MYRA KELEHER CLEANING AGENCY · FLORIDA STATEWIDE
              </Text>

              <Row style={{ maxWidth: "200px", margin: "0 auto 16px auto" }}>
                <Column style={{ textAlign: "center" }}>
                  <Link href={baseUrl} style={{ color: "#555", fontSize: "11px", textDecoration: "none" }}>
                    Website
                  </Link>
                </Column>
                <Column style={{ textAlign: "center" }}>
                  <Link href="https://instagram.com" style={{ color: "#555", fontSize: "11px", textDecoration: "none" }}>
                    Instagram
                  </Link>
                </Column>
              </Row>

              <Text style={{ color: "#2a2a2a", fontSize: "10px", fontFamily: "ui-monospace, monospace", letterSpacing: "0.1em", margin: "0" }}>
                © 2026 Myra Keleher. All systems operational.
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
