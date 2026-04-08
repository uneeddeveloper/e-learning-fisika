import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';
import { c as cn } from './GlassCard-qacKeuuH.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Button",
  __ssrInlineRender: true,
  props: {
    variant: { default: "default" },
    size: { default: "md" },
    disabled: { type: Boolean, default: false },
    type: { default: "button" },
    class: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const classes = computed(() => {
      const base = "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:translate-y-[1px]";
      const size = props.size === "sm" ? "h-9 px-3 text-sm" : "h-10 px-4 text-sm";
      const variant = props.variant === "secondary" ? "bg-white/6 text-zinc-100 border border-white/10 hover:bg-white/8 hover:border-accent-indigo/35 shadow-glow-indigo" : props.variant === "ghost" ? "bg-transparent text-zinc-200 hover:bg-white/5 border border-white/10" : "bg-accent-blue/18 text-zinc-50 border border-accent-blue/25 hover:bg-accent-blue/24 hover:border-accent-blue/45 shadow-glow-blue";
      return cn(base, size, variant, props.class);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        type: __props.type,
        disabled: __props.disabled,
        class: classes.value
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</button>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/button/Button.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Button = Object.assign(_sfc_main, { __name: "UiButton" });

export { Button as B };
//# sourceMappingURL=Button-DqgqCXOR.mjs.map
