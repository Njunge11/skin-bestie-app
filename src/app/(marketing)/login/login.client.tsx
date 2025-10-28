"use client";

import { useState } from "react";
import LoginMarketing from "./login.marketing";
import LoginForm from "./login.form";

export default function LoginClient() {
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
    <div className="grid grid-cols-1 md:grid-cols-2 md:h-[784px]">
      <LoginMarketing />
      <LoginForm
        emailSent={emailSent}
        email={email}
        onEmailSent={handleEmailSent}
        onBackToLogin={handleBackToLogin}
      />
    </div>
  );
}
