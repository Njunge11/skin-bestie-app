"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  $isHeadingNode,
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $createParagraphNode } from "lexical";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Undo2,
  Redo2,
  Quote,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { INSERT_IMAGE_COMMAND } from "./lexical/plugins/ImagesPlugin";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      // Update block type
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [editor, updateToolbar]);

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    } else {
      // If already a heading, convert back to paragraph
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    } else {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const insertImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const src = event.target?.result as string;
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
            altText: file.name,
            src: src,
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const insertLink = () => {
    if (!showLinkInput) {
      setShowLinkInput(true);
    } else if (linkUrl.trim()) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl.trim());
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  const handleLinkCancel = () => {
    setShowLinkInput(false);
    setLinkUrl("");
  };

  return (
    <div
      className="flex items-center gap-1 p-2 border-b bg-white sticky top-0 z-10"
      ref={toolbarRef}
    >
      {/* Undo/Redo - Hidden on mobile */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        disabled={!canUndo}
        className="hidden md:flex h-8 w-8 p-0"
        aria-label="Undo"
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        disabled={!canRedo}
        className="hidden md:flex h-8 w-8 p-0"
        aria-label="Redo"
      >
        <Redo2 className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="hidden md:block mx-1 h-6" />

      {/* Text Formatting */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={`h-8 w-8 p-0 ${isBold ? "bg-muted" : ""}`}
        aria-label="Format Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={`h-8 w-8 p-0 ${isItalic ? "bg-muted" : ""}`}
        aria-label="Format Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={`h-8 w-8 p-0 ${isUnderline ? "bg-muted" : ""}`}
        aria-label="Format Underline"
      >
        <Underline className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Headings */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatHeading("h1")}
        className={`h-8 w-8 p-0 ${blockType === "h1" ? "bg-muted" : ""}`}
        aria-label="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatHeading("h2")}
        className={`h-8 w-8 p-0 ${blockType === "h2" ? "bg-muted" : ""}`}
        aria-label="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatHeading("h3")}
        className={`h-8 w-8 p-0 ${blockType === "h3" ? "bg-muted" : ""}`}
        aria-label="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Lists */}
      <Button
        variant="ghost"
        size="sm"
        onClick={formatBulletList}
        className={`h-8 w-8 p-0 ${blockType === "bullet" ? "bg-muted" : ""}`}
        aria-label="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={formatNumberedList}
        className={`h-8 w-8 p-0 ${blockType === "number" ? "bg-muted" : ""}`}
        aria-label="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Block Quote */}
      <Button
        variant="ghost"
        size="sm"
        onClick={formatQuote}
        className={`h-8 w-8 p-0 ${blockType === "quote" ? "bg-muted" : ""}`}
        aria-label="Block Quote"
      >
        <Quote className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="hidden md:block mx-1 h-6" />

      {/* Link - Hidden on mobile */}
      <div className="relative hidden md:block">
        <Button
          variant="ghost"
          size="sm"
          onClick={insertLink}
          className={`h-8 w-8 p-0 ${showLinkInput ? "bg-muted" : ""}`}
          aria-label="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        {showLinkInput && (
          <>
            <div className="fixed inset-0 z-10" onClick={handleLinkCancel} />
            <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg p-2 z-20 flex gap-2">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="border rounded px-2 py-1 text-sm w-48"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (linkUrl.trim()) {
                      insertLink();
                    }
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    handleLinkCancel();
                  }
                }}
              />
              <Button
                size="sm"
                onClick={insertLink}
                disabled={!linkUrl.trim()}
                className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white"
              >
                Add
              </Button>
              <Button size="sm" variant="ghost" onClick={handleLinkCancel}>
                ✕
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Image */}
      <Button
        variant="ghost"
        size="sm"
        onClick={insertImage}
        className="h-8 w-8 p-0"
        aria-label="Insert Image"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
