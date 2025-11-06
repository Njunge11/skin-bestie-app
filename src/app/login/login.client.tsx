"use client";

import { useState } from "react";
import LoginMarketing from "./login.marketing";
import LoginForm from "./login.form";
import { LoginContent } from "@/utils/extractors/login.extractor";
import Footer from "../(marketing)/footer";

interface LoginClientProps {
  loginContent: LoginContent;
}

export default function LoginClient({ loginContent }: LoginClientProps) {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleEmailSent = (sentEmail: string) => {
    setEmail(sentEmail);
    setEmailSent(true);
  };

  const handleBackToLogin = () => {
    setEmailSent(false);
    setEmail("");
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 md:h-[784px]">
        <LoginMarketing
          backgroundCopy={loginContent.backgroundCopy}
          backgroundImage={loginContent.backgroundImage}
        />
        <LoginForm
          emailSent={emailSent}
          email={email}
          onEmailSent={handleEmailSent}
          onBackToLogin={handleBackToLogin}
          formHeading={loginContent.formHeading}
          formSubheading={loginContent.formSubheading}
        />
      </div>
      <Footer />
    </>
  );
}
