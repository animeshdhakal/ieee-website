"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Bold,
  Italic,
  Heading,
  Link as LinkIcon,
  List,
  Image as ImageIcon,
  Eye,
  Pencil,
  LoaderCircle,
} from "lucide-react";
import { uploadImage } from "@/utils/uploadImage";

type Props = {
  name: string;
  defaultValue?: string;
  rows?: number;
};

type Tab = "write" | "preview";

export function MarkdownEditor({ name, defaultValue = "", rows = 16 }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [tab, setTab] = useState<Tab>("write");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Wrap the current selection (or insert a snippet) and keep focus/caret sane. */
  function surroundSelection(before: string, after = before, placeholder = "") {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      const caret = start + before.length;
      el.setSelectionRange(caret, caret + selected.length);
    });
  }

  /** Insert raw text at the caret (used for image markdown after upload). */
  function insertAtCaret(text: string) {
    const el = textareaRef.current;
    const start = el ? el.selectionStart : value.length;
    const end = el ? el.selectionEnd : value.length;
    const next = value.slice(0, start) + text + value.slice(end);
    setValue(next);
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      const caret = start + text.length;
      el.setSelectionRange(caret, caret);
    });
  }

  async function uploadAndInsert(files: File[]) {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) return;
    setError(null);
    setIsUploading(true);
    try {
      for (const file of images) {
        const url = await uploadImage(file);
        insertAtCaret(`\n![${file.name.replace(/\.[^.]+$/, "")}](${url})\n`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const files = Array.from(e.clipboardData.files);
    if (files.some((f) => f.type.startsWith("image/"))) {
      e.preventDefault();
      void uploadAndInsert(files);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLTextAreaElement>) {
    const files = Array.from(e.dataTransfer.files);
    if (files.some((f) => f.type.startsWith("image/"))) {
      e.preventDefault();
      setIsDragging(false);
      void uploadAndInsert(files);
    }
  }

  const toolBtn =
    "p-2 text-gray-500 hover:text-ieee-blue hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50";

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* The actual form value */}
      <textarea name={name} value={value} readOnly hidden />

      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-2 py-1.5">
        <div className="flex items-center gap-0.5">
          <button type="button" title="Bold" className={toolBtn} onClick={() => surroundSelection("**", "**", "bold text")}>
            <Bold size={16} />
          </button>
          <button type="button" title="Italic" className={toolBtn} onClick={() => surroundSelection("_", "_", "italic text")}>
            <Italic size={16} />
          </button>
          <button type="button" title="Heading" className={toolBtn} onClick={() => surroundSelection("## ", "", "Heading")}>
            <Heading size={16} />
          </button>
          <button type="button" title="Link" className={toolBtn} onClick={() => surroundSelection("[", "](https://)", "link text")}>
            <LinkIcon size={16} />
          </button>
          <button type="button" title="List item" className={toolBtn} onClick={() => surroundSelection("- ", "", "List item")}>
            <List size={16} />
          </button>
          <button
            type="button"
            title="Upload image"
            className={toolBtn}
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? <LoaderCircle size={16} className="animate-spin" /> : <ImageIcon size={16} />}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => uploadAndInsert(Array.from(e.target.files ?? []))}
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${tab === "write" ? "bg-white text-ieee-blue shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Pencil size={13} /> Write
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${tab === "preview" ? "bg-white text-ieee-blue shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Eye size={13} /> Preview
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 text-xs font-medium text-red-700 bg-red-50 border-b border-red-100">
          {error}
        </div>
      )}

      {tab === "write" ? (
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={(e) => {
              if (Array.from(e.dataTransfer.types).includes("Files")) {
                e.preventDefault();
                setIsDragging(true);
              }
            }}
            onDragLeave={() => setIsDragging(false)}
            rows={rows}
            className={`w-full px-4 py-3 text-sm text-gray-900 font-mono leading-relaxed focus:outline-none resize-y transition-colors ${isDragging ? "bg-blue-50" : ""}`}
            placeholder={"## About the Event\n\nWrite the full event details here using Markdown.\n\nAdd images by dragging them in, pasting from your clipboard, or using the image button above."}
          />
          {isDragging && (
            <div className="pointer-events-none absolute inset-2 rounded-lg border-2 border-dashed border-ieee-blue bg-blue-50/60 flex items-center justify-center">
              <span className="text-sm font-bold text-ieee-blue">Drop image to upload</span>
            </div>
          )}
        </div>
      ) : (
        <div className="px-4 py-3 min-h-[16rem]">
          {value.trim() ? (
            <div className="prose prose-blue max-w-none text-gray-700">
              <ReactMarkdown>{value}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
