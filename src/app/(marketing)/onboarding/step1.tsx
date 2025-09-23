"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { ArrowRight, Calendar as CalendarIcon } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { MInput } from "./components/input";
import { MobileNumberInput } from "./components/mobile.number.input";
import { MButton } from "./components/button";
import type { OnboardingSchema } from "./onboarding.types";
import type { CountryCode } from "libphonenumber-js/min";

export default function Step1({ onNext }: { onNext?: () => void }) {
  const {
    register,
    control,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<OnboardingSchema>();

  const [submitting, setSubmitting] = useState(false);

  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const today = new Date().toISOString().slice(0, 10);
  const openNativePicker = () => (dateInputRef.current as any)?.showPicker?.();

  const {
    ref: dobRef,
    onChange: dobOnChange,
    onBlur: dobOnBlur,
    name: dobName,
  } = register("dateOfBirth");

  const handleContinue = async () => {
    if (submitting) return;
    setSubmitting(true);
    const ok = await trigger([
      "firstName",
      "lastName",
      "email",
      "mobileLocal",
      "mobileCountryISO",
      "dateOfBirth",
    ]);
    setSubmitting(false);
    if (ok) onNext?.();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLFormElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleContinue();
    }
  };

  const iso = (watch("mobileCountryISO") ?? "KE") as CountryCode;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      onKeyDown={handleKeyDown}
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pt-7">
        <div>
          <MInput
            id="firstName"
            placeholder="First Name"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName || undefined}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <MInput
            id="lastName"
            placeholder="Last Name"
            autoComplete="family-name"
            aria-invalid={!!errors.lastName || undefined}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3">
        <MInput
          id="email"
          type="email"
          placeholder="Email Address"
          inputMode="email"
          autoComplete="email"
          aria-invalid={!!errors.email || undefined}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="mt-3">
        <Controller
          name="mobileLocal"
          control={control}
          render={({ field }) => (
            <MobileNumberInput
              inputId="mobile"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              name={field.name}
              countryISO={iso}
              onCountryISOChange={async (newIso) => {
                setValue("mobileCountryISO", newIso, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
                // Revalidate the phone input against the new country immediately
                await trigger(["mobileLocal", "mobileCountryISO"]);
              }}
              placeholder="712 345 678"
              aria-invalid={!!errors.mobileLocal || undefined}
            />
          )}
        />
        {errors.mobileLocal && (
          <p className="mt-1 text-sm text-red-600">
            {errors.mobileLocal.message}
          </p>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-stretch overflow-hidden rounded-none bg-[#FFFBE5] border border-[#030303]">
          <button
            type="button"
            onClick={openNativePicker}
            aria-label="Open date picker"
            className="h-[3.125rem] flex items-center justify-center p-4 border-r border-[#030303]"
            tabIndex={-1}
          >
            <CalendarIcon className="h-5 w-5 text-[#030303]" />
          </button>

          <MInput
            id="dateOfBirth"
            name={dobName}
            type="date"
            max={today}
            onChange={dobOnChange}
            onBlur={dobOnBlur}
            aria-invalid={!!errors.dateOfBirth || undefined}
            ref={(el: HTMLInputElement | null) => {
              dateInputRef.current = el;
              dobRef(el);
            }}
            className={cn(
              "flex-1 bg-transparent border-0 shadow-none pl-[0.8125rem]",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              // Only target the indicator, not the entire input
              "[&::-webkit-calendar-picker-indicator]:opacity-0",
              "[&::-webkit-calendar-picker-indicator]:pointer-events-none",
              "[&::-webkit-inner-spin-button]:appearance-none",
              "[&::-webkit-clear-button]:hidden"
            )}
          />
        </div>
        {errors.dateOfBirth && (
          <p className="mt-1 text-sm text-red-600">
            {errors.dateOfBirth.message}
          </p>
        )}
      </div>

      <MButton
        className="mt-6"
        label={submitting ? "Checking..." : "Continue"}
        icon={ArrowRight}
        type="button"
        disabled={submitting}
        onClick={handleContinue}
      />
    </form>
  );
}
