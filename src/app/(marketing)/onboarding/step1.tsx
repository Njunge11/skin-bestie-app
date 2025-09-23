"use client";

import * as React from "react";
import { useRef, useEffect } from "react";
import { ArrowRight, Calendar as CalendarIcon } from "lucide-react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { MInput } from "./components/input";
import { MobileNumberInput } from "./components/mobile.number.input";
import { MButton } from "./components/button";
import type { OnboardingSchema } from "./onboarding.schema";

export default function Step1({ onNext }: { onNext?: () => void }) {
  const {
    register,
    control,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useFormContext<OnboardingSchema>();

  // Revalidate phone when country changes (only if there’s a current value)
  const iso = useWatch({ control, name: "mobileCountryISO" });
  const mobileVal = useWatch({ control, name: "mobileLocal" });

  useEffect(() => {
    if ((mobileVal ?? "").trim()) {
      void trigger("mobileLocal");
    }
  }, [iso, mobileVal, trigger]);

  // Date input helpers
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const openNativePicker = () => (dateInputRef.current as any)?.showPicker?.();
  const todayLocal = (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  })();

  // Merge RHF + local ref to keep showPicker()
  const {
    ref: dobRef,
    onChange: dobOnChange,
    onBlur: dobOnBlur,
    name: dobName,
  } = register("dateOfBirth");

  // ✅ Option A: validate only Step-1 fields, then advance
  const handleContinue = async () => {
    const ok = await trigger(
      [
        "firstName",
        "lastName",
        "email",
        "mobileLocal",
        "mobileCountryISO",
        "dateOfBirth",
      ],
      { shouldFocus: true }
    );
    if (ok) onNext?.();
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate autoComplete="on">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pt-7">
        <div>
          <MInput
            id="firstName"
            placeholder="First Name"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName || undefined}
            {...register("firstName")}
          />
          {errors.firstName ? (
            <p className="mt-1 text-sm text-red-600">
              {errors.firstName.message}
            </p>
          ) : (
            ""
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
          {errors.lastName ? (
            <p className="mt-1 text-sm text-red-600">
              {errors.lastName.message}
            </p>
          ) : (
            ""
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
        {errors.email ? (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        ) : (
          ""
        )}
      </div>

      <div className="mt-3">
        <Controller
          name="mobileLocal"
          control={control}
          render={({ field }) => (
            <MobileNumberInput
              inputId="mobileLocal"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              name={field.name}
              countryISO={iso}
              onCountryISOChange={(newIso) => {
                setValue("mobileCountryISO", newIso, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: false, // effect above will validate if there's a value
                });
              }}
              placeholder="712 345 678"
              aria-invalid={!!errors.mobileLocal || undefined}
            />
          )}
        />
        {errors.mobileLocal ? (
          <p className="mt-1 text-sm text-red-600">
            {errors.mobileLocal.message}
          </p>
        ) : (
          ""
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
            max={todayLocal}
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
              "[&::-webkit-calendar-picker-indicator]:opacity-0",
              "[&::-webkit-inner-spin-button]:appearance-none",
              "[&::-webkit-clear-button]:hidden"
            )}
          />
        </div>
        {errors.dateOfBirth ? (
          <p className="mt-1 text-sm text-red-600">
            {errors.dateOfBirth.message}
          </p>
        ) : (
          ""
        )}
      </div>

      <MButton
        className="mt-6"
        label={isSubmitting ? "Checking..." : "Continue"}
        icon={ArrowRight}
        type="button" // ← not submit
        onClick={handleContinue} // ← only validates step-1 fields
        disabled={isSubmitting}
      />
    </form>
  );
}
