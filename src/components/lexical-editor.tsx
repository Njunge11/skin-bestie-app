"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { useEffect } from "react";
import ToolbarPlugin from "./toolbar-plugin";
import ImagesPlugin from "./lexical/plugins/ImagesPlugin";
import { ImageNode } from "./lexical/nodes/ImageNode";
import "./lexical/ui/ImageResizer.css";

const theme = {
  paragraph: "mb-2",
  heading: {
    h1: "text-3xl font-bold mb-4",
    h2: "text-2xl font-bold mb-3",
    h3: "text-xl font-bold mb-2",
  },
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "list-decimal ml-6 mb-2",
    ul: "list-disc ml-6 mb-2",
    listitem: "mb-1",
  },
  link: "text-skinbestie-primary underline cursor-pointer hover:text-skinbestie-primary/80",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
  quote: "border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4",
  image: "my-4",
};

interface LexicalEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

// Plugin to initialize content
function InitialContentPlugin({ content }: { content?: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (content) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();

        // Split content by newlines to create paragraphs
        const paragraphs = content.split("\n\n");

        paragraphs.forEach((paragraphText) => {
          if (paragraphText.trim()) {
            const paragraph = $createParagraphNode();
            const text = $createTextNode(paragraphText.trim());
            paragraph.append(text);
            root.append(paragraph);
          }
        });
      });
    }
  }, [editor, content]);

  return null;
}

export default function LexicalEditor({
  initialContent,
  onChange,
  placeholder = "Start writing...",
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: "JournalEditor",
    theme,
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      AutoLinkNode,
      ImageNode,
    ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative">
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[400px] outline-none px-0 py-4" />
            }
            placeholder={
              <div className="absolute top-4 left-0 text-muted-foreground pointer-events-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <LinkPlugin />
        <ImagesPlugin />
        <InitialContentPlugin content={initialContent} />
        {onChange && (
          <OnChangePlugin
            onChange={(editorState) => {
              editorState.read(() => {
                const root = $getRoot();
                const text = root.getTextContent();
                onChange(text);
              });
            }}
          />
        )}
      </div>
    </LexicalComposer>
  );
}
