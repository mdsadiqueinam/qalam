import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

export const Page = Node.create({
  name: "page",
  group: "block",
  content: "block+",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='page']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "page",
        class: "page-container",
      }),
      0,
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("pagination"),
        appendTransaction: (transactions, oldState, newState) => {
          const docChanged = transactions.some((tr) => tr.docChanged);
          if (!docChanged) return;

          const view = this.editor.view;
          if (!view || !view.dom) return;

          // Process one overflow at a time to keep positions stable
          let tr = newState.tr;
          let modified = false;

          const PAGE_MAX_HEIGHT = 1000; // Roughly A4 inner height

          newState.doc.descendants((node, pos) => {
            if (modified) return false; // Stop iterating if we already found an overflow

            if (node.type.name === "page") {
              const domNode = view.nodeDOM(pos);
              if (!domNode) return;

              // Check if actual DOM height exceeds max height
              if (
                domNode.scrollHeight > PAGE_MAX_HEIGHT &&
                node.childCount > 1
              ) {
                // Find the last child block to push to the next page
                const lastChild = node.lastChild;
                const lastChildPos =
                  pos + node.nodeSize - lastChild.nodeSize - 1;

                // Create a new page containing this overflowing block
                const newPageNode = this.type.create(null, [lastChild]);

                // 1. Delete the block from the current page
                tr.delete(lastChildPos, lastChildPos + lastChild.nodeSize);

                // 2. Insert the new page immediately after the current page
                // The current page's end position is now shifted because we deleted a node inside it
                const insertPos = pos + node.nodeSize - lastChild.nodeSize;
                tr.insert(insertPos, newPageNode);

                modified = true;
                return false; // Break out of descendants
              }
            }
          });

          if (modified) {
            return tr;
          }
        },
      }),
    ];
  },
});
