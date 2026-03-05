"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code2,
  Minus,
} from "lucide-react";

/**
 * ToolbarButton — small icon button for the editor toolbar.
 */
function ToolbarButton({ onClick, isActive, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg p-2 transition-colors ${
        isActive
          ? "bg-brand-yellow-light text-brand-teal-dark"
          : "text-surface-muted hover:bg-surface hover:text-gray-700"
      }`}
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

/**
 * NoteEditor — Tiptap rich text editor wrapper.
 * Props: initialContent (HTML string), onChange (html => void)
 */
export default function NoteEditor({ initialContent = "", onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Start writing your notes...",
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "tiptap-editor min-h-[300px] px-4 py-3 outline-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-brand-brown bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-brand-brown bg-surface px-2 py-1.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={Bold}
          label="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={Italic}
          label="Italic"
        />

        <div className="mx-1 h-6 w-px bg-brand-brown/30" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          icon={Heading1}
          label="Heading 1"
        />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          icon={Heading2}
          label="Heading 2"
        />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          icon={Heading3}
          label="Heading 3"
        />

        <div className="mx-1 h-6 w-px bg-brand-brown/30" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={List}
          label="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          icon={ListOrdered}
          label="Ordered List"
        />

        <div className="mx-1 h-6 w-px bg-brand-brown/30" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          icon={Code2}
          label="Code Block"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          isActive={false}
          icon={Minus}
          label="Horizontal Rule"
        />
      </div>

      {/* Editor content area */}
      <EditorContent editor={editor} />
    </div>
  );
}
