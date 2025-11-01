import * as React from "react";

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link as EmailLink,
  Preview,
  Text,
} from "@react-email/components";

interface MagicLinkEmailProps {
  url: string;
}

export function MagicLinkEmail({ url }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Sign in to Skin Bestie</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Sign in to Skin Bestie</Heading>

          <Text style={text}>
            Click the button below to sign in to your account:
          </Text>

          <EmailLink href={url} target="_blank" style={button}>
            Sign in
          </EmailLink>

          <Text style={text}>This link will expire in 15 minutes.</Text>

          <Text style={footer}>
            If you didn&apos;t request this email, you can safely ignore it.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default MagicLinkEmail;

// Styles
const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "16px 0",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px 0",
  margin: "24px 0",
};

const footer = {
  color: "#999",
  fontSize: "12px",
  lineHeight: "20px",
  margin: "8px 0",
};
