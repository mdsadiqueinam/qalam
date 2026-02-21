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
    const pageType = this.type;
    let rafId = null;

    function paginateView(view) {
      const { state } = view;
      let handled = false;

      // Split pass: move last child of overflowing page to the next page
      state.doc.forEach((pageNode, pos) => {
        if (handled) return;
        if (pageNode.type !== pageType) return;

        const domNode = view.nodeDOM(pos);
        if (!(domNode instanceof Element)) return;

        // scrollHeight > clientHeight means content overflows the fixed-height page
        if (domNode.scrollHeight > domNode.clientHeight + 2 && pageNode.childCount > 1) {
          const tr = state.tr;
          const lastChild = pageNode.lastChild;
          const lastChildPos = pos + pageNode.nodeSize - lastChild.nodeSize - 1;

          // Remove the overflowing block from the current page
          tr.delete(lastChildPos, lastChildPos + lastChild.nodeSize);

          // Map the next-page start position through the deletion
          const nextPageOrigPos = pos + pageNode.nodeSize;
          const mappedNextPagePos = tr.mapping.map(nextPageOrigPos);
          const nextNode = state.doc.nodeAt(nextPageOrigPos);

          if (nextNode && nextNode.type === pageType) {
            // Insert at the beginning of the existing next page
            tr.insert(mappedNextPagePos + 1, lastChild);
          } else {
            // Create a new page containing the overflowing block
            tr.insert(mappedNextPagePos, pageType.create(null, lastChild));
          }

          view.dispatch(tr.setMeta("pagination", true));
          handled = true;
        }
      });

      if (handled) return;

      // Merge pass: pull first block from next page into current page if it fits
      state.doc.forEach((pageNode, pos) => {
        if (handled) return;
        if (pageNode.type !== pageType) return;

        const domNode = view.nodeDOM(pos);
        if (!(domNode instanceof Element)) return;

        const nextPageOrigPos = pos + pageNode.nodeSize;
        const nextNode = state.doc.nodeAt(nextPageOrigPos);
        if (!nextNode || nextNode.type !== pageType) return;

        const nextDomNode = view.nodeDOM(nextPageOrigPos);
        if (!(nextDomNode instanceof Element)) return;

        // Skip if the next page is somehow empty (schema requires block+, so this is a safety guard)
        if (nextNode.childCount === 0) return;

        const firstChildOfNext = nextNode.firstChild;
        const firstChildDom = nextDomNode.firstElementChild;
        if (!firstChildDom) return;

        const maxHeight = domNode.clientHeight;
        const currentHeight = domNode.scrollHeight;
        const firstChildHeight = firstChildDom.offsetHeight;

        // Check if the first block of the next page fits in the current page
        if (currentHeight + firstChildHeight <= maxHeight - 2) {
          const tr = state.tr;

          // Remove the first child from the next page
          const firstChildInNextPos = nextPageOrigPos + 1;
          tr.delete(firstChildInNextPos, firstChildInNextPos + firstChildOfNext.nodeSize);

          // If next page becomes empty after removal, remove the page itself.
          // An empty page has nodeSize = nextNode.nodeSize - firstChildOfNext.nodeSize
          // (the original nodeSize minus the child we just deleted, leaving just the 2 open/close tokens).
          if (nextNode.childCount === 1) {
            const mappedNextPagePos = tr.mapping.map(nextPageOrigPos);
            const emptyPageSize = nextNode.nodeSize - firstChildOfNext.nodeSize;
            tr.delete(mappedNextPagePos, mappedNextPagePos + emptyPageSize);
          }

          // Append the block at the end of the current page (before its closing token)
          const currentPageEndPos = tr.mapping.map(pos + pageNode.nodeSize - 1);
          tr.insert(currentPageEndPos, firstChildOfNext);

          view.dispatch(tr.setMeta("pagination", true));
          handled = true;
        }
      });
    }

    return [
      new Plugin({
        key: new PluginKey("pagination"),
        view() {
          return {
            update(view, prevState) {
              if (prevState.doc.eq(view.state.doc)) return;

              if (rafId) cancelAnimationFrame(rafId);
              rafId = requestAnimationFrame(() => {
                rafId = null;
                paginateView(view);
              });
            },
            destroy() {
              if (rafId) cancelAnimationFrame(rafId);
            },
          };
        },
      }),
    ];
  },
});
