"use client";

import dynamic from "next/dynamic";

const LexicalEditor = dynamic(() => import("./lexical-editor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface WYSIWYGProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

export function WYSIWYG({
  initialContent,
  onChange,
  placeholder = "Start writing...",
}: WYSIWYGProps) {
  return (
    <div className="w-full">
      <LexicalEditor
        initialContent={initialContent}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
