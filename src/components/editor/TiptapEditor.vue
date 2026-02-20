<script setup>
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { BubbleMenu } from "@tiptap/vue-3/menus";
import { StarterKit } from "@tiptap/starter-kit";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  Bars3BottomLeftIcon,
  Bars3CenterLeftIcon,
  Bars3BottomRightIcon,
  ListBulletIcon,
} from "@heroicons/vue/24/outline";
import EditorToolbar from "./EditorToolbar.vue";
import { watch } from "vue";

// --- Props & models
const modelValue = defineModel({ type: String, default: "" });
const font = ref("Noto Naskh Arabic");

// --- Refs for Toolbar
const formats = ref([]);
const align = ref("right");
const list = ref(false);

// --- Use
const editor = useEditor({
  extensions: [
    StarterKit,
    TextStyleKit,
    TextAlign.configure({
      types: ["heading", "paragraph"],
      defaultAlignment: "right",
    }),
  ],
  content: modelValue.value,
  editorProps: {
    attributes: {
      class:
        "prose max-w-none h-full w-full focus:outline-none  text-base leading-relaxed text-main-text",
      dir: "rtl",
      spellcheck: "false",
    },
  },
  onUpdate({ editor: e }) {
    modelValue.value = e.getHTML();
    updateToolbarState(e);
  },
  onSelectionUpdate({ editor: e }) {
    updateToolbarState(e);
  },
});

function updateToolbarState(e) {
  // Formats
  const activeFormats = [];
  if (e.isActive("bold")) activeFormats.push("bold");
  if (e.isActive("italic")) activeFormats.push("italic");
  if (e.isActive("underline")) activeFormats.push("underline");
  formats.value = activeFormats;

  // Align
  if (e.isActive({ textAlign: "left" })) align.value = "left";
  else if (e.isActive({ textAlign: "center" })) align.value = "center";
  else align.value = "right"; // Default to right for RTL

  // List
  list.value = e.isActive("bulletList");
}

// --- Watchers to apply changes from Toolbar
watch(formats, (newFormats) => {
  if (!editor.value) return;
  const isBold = newFormats.includes("bold");
  if (editor.value.isActive("bold") !== isBold)
    editor.value.chain().focus().toggleBold().run();

  const isItalic = newFormats.includes("italic");
  if (editor.value.isActive("italic") !== isItalic)
    editor.value.chain().focus().toggleItalic().run();

  const isUnderline = newFormats.includes("underline");
  if (editor.value.isActive("underline") !== isUnderline)
    editor.value.chain().focus().toggleUnderline().run();
});

watch(align, (newAlign) => {
  if (!editor.value) return;
  if (!editor.value.isActive({ textAlign: newAlign })) {
    editor.value.chain().focus().setTextAlign(newAlign).run();
  }
});

watch(list, (newList) => {
  if (!editor.value) return;
  if (editor.value.isActive("bulletList") !== newList) {
    editor.value.chain().focus().toggleBulletList().run();
  }
});

watch(font, (newFont) => {
  if (!editor.value) return;
  editor.value.chain().focus().setFontFamily(newFont).run();
});

// --- Computed
const wordCount = computed(() => {
  const text = editor.value?.getText() ?? "";
  if (!text.trim()) return 0;
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
});

// --- Handlers
function insertText(text) {
  if (!editor.value) return;
  editor.value.chain().focus().insertContent(text).run();
}

function deleteChar() {
  if (!editor.value) return;
  editor.value
    .chain()
    .focus()
    .deleteRange({
      from: editor.value.state.selection.from - 1,
      to: editor.value.state.selection.from,
    })
    .run();
}

// Toolbar Handlers
// Toolbar Handlers removed as logic is now in watchers

// --- Exposed
defineExpose({ editor, insertText, deleteChar });
</script>

<template>
  <div class="relative flex flex-1 flex-col overflow-hidden">
    <!-- Toolbar -->
    <EditorToolbar
      v-if="editor"
      v-model:font="font"
      v-model:formats="formats"
      v-model:align="align"
      v-model:list="list"
      :wordCount="wordCount"
    />

    <!-- Bubble Menu Toolbar (appears on text selection) -->
    <BubbleMenu
      v-if="editor"
      :editor="editor"
      :options="{ placement: 'top', offset: 8 }"
      :updateDelay="0"
      :shouldShow="({ state }) => !state.selection.empty"
      class="flex items-center gap-px rounded-lg border border-border-default bg-sidebar shadow-lg p-0.5"
    >
      <!-- Bold -->
      <button
        class="rounded p-1 transition-colors"
        :class="
          editor.isActive('bold')
            ? 'bg-primary/10 text-primary'
            : 'text-main-text-muted hover:bg-main-unselected hover:text-main-text'
        "
        @click="editor.chain().focus().toggleBold().run()"
      >
        <BoldIcon class="h-3.5 w-3.5" />
      </button>

      <!-- Italic -->
      <button
        class="rounded p-1 transition-colors"
        :class="
          editor.isActive('italic')
            ? 'bg-primary/10 text-primary'
            : 'text-main-text-muted hover:bg-main-unselected hover:text-main-text'
        "
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <ItalicIcon class="h-3.5 w-3.5" />
      </button>

      <!-- Underline -->
      <button
        class="rounded p-1 transition-colors"
        :class="
          editor.isActive('underline')
            ? 'bg-primary/10 text-primary'
            : 'text-main-text-muted hover:bg-main-unselected hover:text-main-text'
        "
        @click="editor.chain().focus().toggleUnderline().run()"
      >
        <UnderlineIcon class="h-3.5 w-3.5" />
      </button>

      <div class="mx-0.5 h-4 w-px bg-divider" />

      <!-- Align Right (default for Arabic) -->
      <button
        class="rounded p-1 transition-colors"
        :class="
          editor.isActive({ textAlign: 'right' })
            ? 'bg-primary/10 text-primary'
            : 'text-main-text-muted hover:bg-main-unselected hover:text-main-text'
        "
        @click="editor.chain().focus().setTextAlign('right').run()"
      >
        <Bars3BottomRightIcon class="h-3.5 w-3.5" />
      </button>

      <!-- Align Center -->
      <button
        class="rounded p-1 transition-colors"
        :class="
          editor.isActive({ textAlign: 'center' })
            ? 'bg-primary/10 text-primary'
            : 'text-main-text-muted hover:bg-main-unselected hover:text-main-text'
        "
        @click="editor.chain().focus().setTextAlign('center').run()"
      >
        <Bars3CenterLeftIcon class="h-3.5 w-3.5" />
      </button>

      <!-- Align Left -->
      <button
        class="rounded p-1 transition-colors"
        :class="
          editor.isActive({ textAlign: 'left' })
            ? 'bg-primary/10 text-primary'
            : 'text-main-text-muted hover:bg-main-unselected hover:text-main-text'
        "
        @click="editor.chain().focus().setTextAlign('left').run()"
      >
        <Bars3BottomLeftIcon class="h-3.5 w-3.5" />
      </button>

      <div class="mx-0.5 h-4 w-px bg-divider" />

      <!-- Bullet List -->
      <button
        class="rounded p-1 transition-colors"
        :class="
          editor.isActive('bulletList')
            ? 'bg-primary/10 text-primary'
            : 'text-main-text-muted hover:bg-main-unselected hover:text-main-text'
        "
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <ListBulletIcon class="h-3.5 w-3.5" />
      </button>
    </BubbleMenu>

    <!-- Editor Content -->
    <EditorContent :editor="editor" class="flex-1 overflow-y-auto p-3" />
  </div>
</template>

<style scoped>
:deep(.tiptap) {
  direction: rtl;
  text-align: right;
  height: 100%;
  caret-color: var(--color-primary, #6366f1);
}

:deep(.tiptap p) {
  margin: 0 0 0.5em;
}

:deep(.tiptap ul) {
  list-style-type: disc;
  padding-right: 1.5em;
  padding-left: 0;
}

:deep(.tiptap:focus) {
  outline: none;
}
</style>
