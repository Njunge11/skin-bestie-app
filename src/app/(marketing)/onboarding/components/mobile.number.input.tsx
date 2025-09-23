"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { MInput } from "./input";
import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js/min";

function flagFromISO(iso: string) {
  return String.fromCodePoint(
    ...iso
      .toUpperCase()
      .split("")
      .map((c) => 127397 + c.charCodeAt(0))
  );
}

export interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  name?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  countryISO?: CountryCode;
  onCountryISOChange?: (iso: CountryCode) => void;
  placeholder?: string;
  className?: string;
  inputId?: string;
  "aria-invalid"?: boolean;
}

export function MobileNumberInput({
  value,
  onChange,
  onBlur,
  name,
  inputRef,
  countryISO,
  onCountryISOChange,
  placeholder = "712 345 678",
  className,
  inputId,
  ...rest
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);

  // Build once (cheap) — list of all countries from the lib
  const options = useMemo(() => {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return getCountries().map((iso) => {
      const code = `+${getCountryCallingCode(iso)}`;
      const name = regionNames.of(iso) ?? iso;
      return { iso, code, name, flag: flagFromISO(iso) } as {
        iso: CountryCode;
        code: string;
        name: string;
        flag: string;
      };
    });
  }, []);

  const selected =
    options.find((o) => o.iso === countryISO) ??
    options.find((o) => o.iso === "KE") ??
    options[0];

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-stretch overflow-hidden rounded-none bg-[#FFFBE5] border border-[#030303]/50">
        <div className="flex items-stretch border-r border-[#030303]/50">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                role="combobox"
                aria-expanded={open}
                className="self-stretch flex items-center gap-[0.5625rem] px-4 py-[0.875rem]
                           rounded-none bg-transparent hover:bg-transparent focus:ring-0 focus:ring-offset-0
                           text-[#272B2D] font-medium text-[1rem] leading-[1.5] tracking-[-0.01em] h-[3.125rem]"
              >
                <span className="text-lg">{selected.flag}</span>
                <span>{selected.code}</span>
                <ChevronDown className="ml-2 w-[0.72938rem] h-[0.44563rem] shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0">
              <Command>
                <CommandInput placeholder="Search countries..." />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {options.map(({ iso, name, code, flag }) => (
                      <CommandItem
                        key={iso}
                        value={`${name} ${iso} ${code}`}
                        onSelect={() => {
                          onCountryISOChange?.(iso);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{flag}</span>
                          <span className="text-[#272B2D]">{code}</span>
                          <span className="text-[#878481]">{name}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <MInput
          id={inputId}
          name={name}
          ref={inputRef as any}
          type="tel"
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={cn(
            "flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pr-4",
            "pl-[0.8125rem]"
          )}
          inputMode="tel"
          autoComplete="tel"
          {...rest}
        />
      </div>
    </div>
  );
}
