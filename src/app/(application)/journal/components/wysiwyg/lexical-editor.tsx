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
import { useEffect, useState } from "react";
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
  initialContent?: unknown;
  onChange?: (content: string) => void;
  placeholder?: string;
}

// Plugin to initialize content
function InitialContentPlugin({ content }: { content?: unknown }) {
  const [editor] = useLexicalComposerContext();
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    // Only run once on mount
    if (!isFirstRender || !content) return;
    setIsFirstRender(false);

    // If content is already an object (LexicalJSON from backend)
    if (typeof content === "object" && content !== null) {
      try {
        const lexical = content as { root?: { children?: unknown[] } };
        // Check if content is empty
        if (
          !lexical.root ||
          !lexical.root.children ||
          lexical.root.children.length === 0
        ) {
          // Don't set empty state, let Lexical use default
          return;
        }

        // Convert object to JSON string and parse as EditorState
        const jsonString = JSON.stringify(content);
        const editorState = editor.parseEditorState(jsonString);
        editor.setEditorState(editorState);
      } catch (error) {
        console.error("Failed to parse LexicalJSON object:", error);
      }
      return;
    }

    // If content is a string
    if (typeof content === "string") {
      // Check if content is valid JSON first
      let isValidJSON = false;
      try {
        JSON.parse(content);
        isValidJSON = true;
      } catch {
        isValidJSON = false;
      }

      if (isValidJSON) {
        // Content is JSON, try parsing as Lexical EditorState
        try {
          const editorState = editor.parseEditorState(content);
          editor.setEditorState(editorState);
        } catch (error) {
          console.error("Valid JSON but not valid Lexical EditorState:", error);
          // Don't insert anything - let Lexical use default empty state
        }
      } else if (content.trim()) {
        // Content is plain text (only if not empty)
        editor.update(
          () => {
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
          },
          { tag: "history-merge" },
        );
      }
    }
  }, [editor, content, isFirstRender]);

  return null;
}

export default function LexicalEditor({
  initialContent,
  onChange,
  placeholder = "Start writing...",
}: LexicalEditorProps) {
  const [isInitialized, setIsInitialized] = useState(false);

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
              // Skip onChange during initialization to prevent unnecessary API calls
              if (!isInitialized) {
                setIsInitialized(true);
                return;
              }

              // Serialize entire EditorState to JSON
              const jsonString = JSON.stringify(editorState.toJSON());
              onChange(jsonString);
            }}
          />
        )}
      </div>
    </LexicalComposer>
  );
}
