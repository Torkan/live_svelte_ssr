// import { createRoot } from "svelte";
const propField = "svelte_page_props";

function buildPropsAndCtx(obj) {
  const { locale, ...props } = window[propField];

  const context = new Map();
  context.set("locale", locale);
  context.set("live", obj);

  return { props, context };
}

function propsInitListener(obj) {
  return function propsInit(_event) {
    if (obj._instance) {
      obj._instance.$destroy();
    }

    const { props, context } = buildPropsAndCtx(obj);

    obj._instance = new obj._component({
      target: obj.el,
      props,
      context,
    });
  };
}

function propsPatchListener(obj) {
  return function propsPatch() {
    const { locale, ...props } = window[propField];

    obj._instance.$set(props);
  };
}

export const SvelteHook = {
  _propsInitListener: null,
  _propsPatchListener: null,
  _instance: null,
  _component: null,
  mounted() {
    const componentName = this.el.getAttribute("data-component-module");

    const obj = this;
    import(componentName).then((module) => {
      if (window[propField]) {
        const { props, context } = buildPropsAndCtx(this);

        obj._component = module.default;
        obj._instance = new module.default({
          target: this.el,
          props,
          context,
        });
      }
      this._propsInitListener = propsInitListener(this);
      this._propsPatchListener = propsPatchListener(this);
      window.addEventListener(
        "svelte_page_props_initialized",
        this._propsInitListener,
        false
      );
      window.addEventListener(
        "svelte_page_props_patched",
        this._propsPatchListener,
        false
      );
    });
  },
  reconnected() {
    const { props, context } = buildPropsAndCtx(this);

    this._instance.$destroy();
    this._instance = new this._component({
      target: this.el,
      props,
      context,
    });
  },
  destroyed() {
    window.removeEventListener(
      "svelte_page_props_initialized",
      this._propsInitListener
    );
    window.removeEventListener(
      "svelte_page_props_patched",
      this._propsPatchListener
    );
    window.svelte_page_props = null;
    if (this._instance) {
      this._instance.$destroy();
    }
  },
};
