import * as jsonpatch from "fast-json-patch";

function dispatchGlobalEvent(eventName) {
  let event;

  if (typeof window.CustomEvent === "function") {
    event = new window.CustomEvent(eventName, {});
  } else {
    event = document.createEvent("Event");
    event.initEvent(eventName, false, true);
  }
  window.dispatchEvent(event);
}

export function createLiveJsonHooks() {
  return {
    LiveJSON: {
      mounted() {
        /*
          Patch and Track
          */

        this.handleEvent("lj:patch", ({ doc_name, patch, method }) => {
          window[doc_name] = jsonpatch.applyPatch(
            window[doc_name],
            patch
          ).newDocument;

          dispatchGlobalEvent(doc_name + "_patched");
        });

        this.handleEvent("lj:init", ({ doc_name, data }) => {
          window[doc_name] = data;
          dispatchGlobalEvent(doc_name + "_initialized");
        });

        /*
          Local Utilities
          */

        this.handleEvent("lj:assign", ({ doc_name, data }) => {
          window[doc_name] = data;
          dispatchGlobalEvent(doc_name + "_assigned");
        });

        this.handleEvent("lj:append", ({ doc_name, data }) => {
          if (!(doc_name in window)) {
            window[doc_name] = [];
          }
          window[doc_name].push(data);
          dispatchGlobalEvent(doc_name + "_appended");
        });

        this.handleEvent("lj:put", ({ doc_name, key, value }) => {
          if (!(doc_name in window)) {
            window[doc_name] = {};
          }
          window[doc_name].set(key, value);
          dispatchGlobalEvent(doc_name + "_put");
        });

        /*
          Remote Utilities
          */
        this.el.addEventListener("send_data", (e) => {
          this.pushEvent(e.detail.name, e.detail.data);
          dispatchGlobalEvent("data_sent");
          dispatchGlobalEvent(e.detail.name + "_sent");
        });
      },
    },
  };
}
