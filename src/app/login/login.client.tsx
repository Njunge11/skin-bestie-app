"use client";

import LoginMarketing from "./login.marketing";
import LoginForm from "./login.form";
import { LoginContent } from "@/utils/extractors/login.extractor";
import Footer from "../(marketing)/footer";

interface LoginClientProps {
  loginContent: LoginContent;
}

export default function LoginClient({ loginContent }: LoginClientProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 md:h-[784px]">
        <LoginMarketing
          backgroundCopy={loginContent.backgroundCopy}
          backgroundImage={loginContent.backgroundImage}
        />
        <LoginForm
          emailSent={false}
          email=""
          onEmailSent={() => {}}
          onBackToLogin={() => {}}
          formHeading={loginContent.formHeading}
          formSubheading={loginContent.formSubheading}
        />
      </div>
      <Footer />
    </>
  );
}
