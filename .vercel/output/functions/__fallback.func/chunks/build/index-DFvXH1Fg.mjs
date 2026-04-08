import { defineComponent, ref, computed, h, mergeProps, withCtx, unref, createVNode, createTextVNode, openBlock, createBlock, Fragment, renderList, resolveDynamicComponent, toDisplayString, createCommentVNode, renderSlot, watch, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderVNode, ssrInterpolate, ssrRenderSlot, ssrRenderTeleport } from 'vue/server-renderer';
import { Bell, Sparkles, Users, Layers, ClipboardCheck, ArrowUpRight, Video, FileText, CheckCircle2, ChevronRight, Activity, MessageSquare, Timer, Upload, X } from 'lucide-vue-next';
import { B as Button } from './Button-DqgqCXOR.mjs';
import { G as GlassCard } from './GlassCard-qacKeuuH.mjs';
import { I as Input } from './Input-nEQ2kwWY.mjs';
import 'tailwind-merge';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "StatCard",
  __ssrInlineRender: true,
  props: {
    label: {},
    value: {},
    delta: { default: "" },
    tone: { default: "blue" },
    icon: {}
  },
  setup(__props) {
    const props = __props;
    const deltaClass = computed(() => {
      const isUp = String(props.delta).trim().startsWith("+");
      return isUp ? "text-emerald-300" : "text-rose-300";
    });
    const iconGlowClass = computed(() => props.tone === "indigo" ? "shadow-glow-indigo" : "shadow-glow-blue");
    const iconBlurBgClass = computed(() => props.tone === "indigo" ? "bg-accent-indigo/20" : "bg-accent-blue/18");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(GlassCard, mergeProps({ class: "p-5" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-start justify-between gap-4"${_scopeId}><div class="min-w-0"${_scopeId}><p class="text-xs font-semibold tracking-wide text-zinc-400"${_scopeId}>${ssrInterpolate(__props.label)}</p><div class="mt-2 flex items-baseline gap-2"${_scopeId}><p class="text-2xl font-extrabold tracking-tight text-zinc-50"${_scopeId}>${ssrInterpolate(__props.value)}</p>`);
            if (__props.delta) {
              _push2(`<p class="${ssrRenderClass([deltaClass.value, "text-xs font-semibold"])}"${_scopeId}>${ssrInterpolate(__props.delta)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            ssrRenderSlot(_ctx.$slots, "sub", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div><div class="${ssrRenderClass([iconGlowClass.value, "relative grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5"])}"${_scopeId}><div class="${ssrRenderClass([iconBlurBgClass.value, "pointer-events-none absolute inset-0 rounded-2xl opacity-80 blur-xl"])}"${_scopeId}></div>`);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(__props.icon), { class: "relative h-5 w-5 text-zinc-50" }, null), _parent2, _scopeId);
            _push2(`</div></div>`);
            ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                createVNode("div", { class: "min-w-0" }, [
                  createVNode("p", { class: "text-xs font-semibold tracking-wide text-zinc-400" }, toDisplayString(__props.label), 1),
                  createVNode("div", { class: "mt-2 flex items-baseline gap-2" }, [
                    createVNode("p", { class: "text-2xl font-extrabold tracking-tight text-zinc-50" }, toDisplayString(__props.value), 1),
                    __props.delta ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: ["text-xs font-semibold", deltaClass.value]
                    }, toDisplayString(__props.delta), 3)) : createCommentVNode("", true)
                  ]),
                  renderSlot(_ctx.$slots, "sub")
                ]),
                createVNode("div", {
                  class: ["relative grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5", iconGlowClass.value]
                }, [
                  createVNode("div", {
                    class: ["pointer-events-none absolute inset-0 rounded-2xl opacity-80 blur-xl", iconBlurBgClass.value]
                  }, null, 2),
                  (openBlock(), createBlock(resolveDynamicComponent(__props.icon), { class: "relative h-5 w-5 text-zinc-50" }))
                ], 2)
              ]),
              renderSlot(_ctx.$slots, "footer")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/StatCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const StatCard = Object.assign(_sfc_main$2, { __name: "UiStatCard" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Dialog",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const panel = ref(null);
    watch(() => props.open, async (v) => {
      if (!v) return;
      await nextTick();
      panel.value?.focus();
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"><div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div><div class="relative w-full max-w-xl rounded-3xl glass-card border-glow shadow-[0_1px_0_rgba(255,255,255,0.06),0_28px_90px_rgba(0,0,0,0.60)]" role="dialog" aria-modal="true" tabindex="-1"><div class="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-b from-accent-blue/16 via-transparent to-accent-indigo/14 blur-[10px]"></div><div class="relative p-6">`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dialog/Dialog.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Dialog = Object.assign(_sfc_main$1, { __name: "UiDialog" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const isUploadOpen = ref(false);
    const uploadType = ref("video");
    const uploadTitle = ref("");
    const stats = computed(() => ({
      students: { value: 342, delta: "+8.2%", trend: [28, 24, 31, 29, 33, 38, 41] },
      courses: { value: 12, delta: "+1", trend: [10, 10, 11, 11, 11, 12, 12] },
      toGrade: { value: 19, delta: "-6", trend: [27, 24, 22, 21, 19, 19, 19] }
    }));
    const materials = [
      { id: "m1", title: "Hukum Newton II — latihan konsep", meta: "Video · 12:40 · Kelas X", status: "Draft", icon: Video, tone: "blue" },
      { id: "m2", title: "Gelombang mekanik — ringkasan cepat", meta: "Reading · 6 min · Kelas XI", status: "Review", icon: FileText, tone: "indigo" },
      { id: "m3", title: "Kuis: Energi & Usaha", meta: "Quiz · 10 soal · Kelas X", status: "Ready", icon: CheckCircle2, tone: "blue" }
    ];
    const activity = [
      { id: "a1", title: "28 students completed “Newton Quiz”", detail: "Median score 78 · 6 need follow-up", time: "2m ago", icon: Activity },
      { id: "a2", title: "New comment on “Gelombang mekanik”", detail: "“Bagian interferensi masih bingung…”", time: "11m ago", icon: MessageSquare },
      { id: "a3", title: "Auto-reminder sent", detail: "Assignment “Usaha & Energi” due tomorrow", time: "1h ago", icon: Timer }
    ];
    const MiniBadge = defineComponent({
      props: { label: { type: String, required: true } },
      setup(props) {
        return () => h(
          "span",
          { class: "inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300" },
          props.label
        );
      }
    });
    const Sparkline = defineComponent({
      props: {
        points: { type: Array, required: true }
      },
      setup(props) {
        const path = computed(() => {
          const pts = props.points;
          const max = Math.max(...pts);
          const min = Math.min(...pts);
          const range = Math.max(1, max - min);
          return pts.map((v, i) => {
            const x = i / Math.max(1, pts.length - 1) * 100;
            const y = 100 - (v - min) / range * 100;
            return `${x.toFixed(2)},${y.toFixed(2)}`;
          }).join(" ");
        });
        return () => h("div", { class: "rounded-2xl border border-white/10 bg-white/5 p-3" }, [
          h("div", { class: "flex items-center justify-between" }, [
            h("p", { class: "text-xs font-semibold text-zinc-300" }, "Trend"),
            h("p", { class: "text-xs text-zinc-600" }, "sparkline")
          ]),
          h("svg", { viewBox: "0 0 100 100", class: "mt-2 h-10 w-full" }, [
            h("defs", {}, [
              h("linearGradient", { id: "spark", x1: "0", y1: "0", x2: "1", y2: "0" }, [
                h("stop", { offset: "0", "stop-color": "rgba(59,130,246,0.9)" }),
                h("stop", { offset: "1", "stop-color": "rgba(99,102,241,0.9)" })
              ])
            ]),
            h("polyline", {
              fill: "none",
              stroke: "url(#spark)",
              "stroke-width": "4",
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              points: path.value
            })
          ])
        ]);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative" }, _attrs))}><div class="flex flex-wrap items-end justify-between gap-4"><div><p class="text-xs font-semibold tracking-wide text-zinc-500">Teacher Dashboard</p><h1 class="mt-1 text-2xl font-extrabold tracking-tight text-zinc-50"> Control room untuk kelas fisika </h1><p class="mt-2 max-w-2xl text-sm text-zinc-400"> Prototype hi-fi: bento grid, glassmorphism, dan micro-interactions untuk workflow guru. </p></div><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(Button, {
        variant: "secondary",
        size: "md"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Bell), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            _push2(` Notifikasi `);
          } else {
            return [
              createVNode(unref(Bell), { class: "h-4 w-4" }),
              createTextVNode(" Notifikasi ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(Button, { size: "md" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Sparkles), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            _push2(` Generate Insight `);
          } else {
            return [
              createVNode(unref(Sparkles), { class: "h-4 w-4" }),
              createTextVNode(" Generate Insight ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="mt-6 grid gap-4 lg:grid-cols-12"><div class="lg:col-span-4">`);
      _push(ssrRenderComponent(StatCard, {
        label: "Total Students",
        value: stats.value.students.value,
        delta: stats.value.students.delta,
        icon: unref(Users),
        tone: "blue"
      }, {
        sub: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="mt-2 text-xs text-zinc-500"${_scopeId}>Last 7 days</p>`);
          } else {
            return [
              createVNode("p", { class: "mt-2 text-xs text-zinc-500" }, "Last 7 days")
            ];
          }
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Sparkline), {
              points: stats.value.students.trend
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "mt-4" }, [
                createVNode(unref(Sparkline), {
                  points: stats.value.students.trend
                }, null, 8, ["points"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="lg:col-span-4">`);
      _push(ssrRenderComponent(StatCard, {
        label: "Active Courses",
        value: stats.value.courses.value,
        delta: stats.value.courses.delta,
        icon: unref(Layers),
        tone: "indigo"
      }, {
        sub: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="mt-2 text-xs text-zinc-500"${_scopeId}>Published &amp; accessible</p>`);
          } else {
            return [
              createVNode("p", { class: "mt-2 text-xs text-zinc-500" }, "Published & accessible")
            ];
          }
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mt-4 grid grid-cols-3 gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(["Mechanics", "Waves", "Thermo"], (tag) => {
              _push2(ssrRenderComponent(unref(MiniBadge), {
                key: tag,
                label: tag
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "mt-4 grid grid-cols-3 gap-2" }, [
                (openBlock(), createBlock(Fragment, null, renderList(["Mechanics", "Waves", "Thermo"], (tag) => {
                  return createVNode(unref(MiniBadge), {
                    key: tag,
                    label: tag
                  }, null, 8, ["label"]);
                }), 64))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="lg:col-span-4">`);
      _push(ssrRenderComponent(StatCard, {
        label: "Assignments to Grade",
        value: stats.value.toGrade.value,
        delta: stats.value.toGrade.delta,
        icon: unref(ClipboardCheck),
        tone: "blue"
      }, {
        sub: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="mt-2 text-xs text-zinc-500"${_scopeId}>Priority: high-impact</p>`);
          } else {
            return [
              createVNode("p", { class: "mt-2 text-xs text-zinc-500" }, "Priority: high-impact")
            ];
          }
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"${_scopeId}><p class="text-xs font-semibold text-zinc-300"${_scopeId}>Suggested focus</p><p class="text-xs font-semibold text-emerald-300"${_scopeId}>Newton Quiz</p></div>`);
          } else {
            return [
              createVNode("div", { class: "mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3" }, [
                createVNode("p", { class: "text-xs font-semibold text-zinc-300" }, "Suggested focus"),
                createVNode("p", { class: "text-xs font-semibold text-emerald-300" }, "Newton Quiz")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="lg:col-span-7">`);
      _push(ssrRenderComponent(GlassCard, { class: "p-6" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between gap-4"${_scopeId}><div${_scopeId}><h2 class="text-lg font-extrabold tracking-tight text-zinc-50"${_scopeId}>Recent Materials</h2><p class="mt-1 text-sm text-zinc-500"${_scopeId}>Drafts &amp; publish-ready items</p></div>`);
            _push2(ssrRenderComponent(Button, {
              variant: "ghost",
              size: "sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ArrowUpRight), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                  _push3(` View all `);
                } else {
                  return [
                    createVNode(unref(ArrowUpRight), { class: "h-4 w-4" }),
                    createTextVNode(" View all ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="mt-5 space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(materials, (m) => {
              _push2(`<button class="group/material w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-left transition-all duration-200 hover:bg-white/5 hover:border-accent-blue/35" type="button"${_scopeId}><div class="flex items-center justify-between gap-3"${_scopeId}><div class="flex min-w-0 items-center gap-3"${_scopeId}><div class="relative grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5"${_scopeId}><div class="${ssrRenderClass([m.tone === "indigo" ? "bg-accent-indigo/25" : "bg-accent-blue/20", "pointer-events-none absolute inset-0 rounded-2xl opacity-70 blur-xl"])}"${_scopeId}></div>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(m.icon), { class: "relative h-5 w-5 text-zinc-50" }, null), _parent2, _scopeId);
              _push2(`</div><div class="min-w-0"${_scopeId}><p class="truncate text-sm font-bold text-zinc-50"${_scopeId}>${ssrInterpolate(m.title)}</p><p class="mt-0.5 text-xs text-zinc-500"${_scopeId}>${ssrInterpolate(m.meta)}</p></div></div><div class="flex items-center gap-3"${_scopeId}><span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300"${_scopeId}>${ssrInterpolate(m.status)}</span>`);
              _push2(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4 text-zinc-600 transition-transform duration-200 group-hover/material:translate-x-0.5" }, null, _parent2, _scopeId));
              _push2(`</div></div></button>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                createVNode("div", null, [
                  createVNode("h2", { class: "text-lg font-extrabold tracking-tight text-zinc-50" }, "Recent Materials"),
                  createVNode("p", { class: "mt-1 text-sm text-zinc-500" }, "Drafts & publish-ready items")
                ]),
                createVNode(Button, {
                  variant: "ghost",
                  size: "sm"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(ArrowUpRight), { class: "h-4 w-4" }),
                    createTextVNode(" View all ")
                  ]),
                  _: 1
                })
              ]),
              createVNode("div", { class: "mt-5 space-y-2" }, [
                (openBlock(), createBlock(Fragment, null, renderList(materials, (m) => {
                  return createVNode("button", {
                    key: m.id,
                    class: "group/material w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-left transition-all duration-200 hover:bg-white/5 hover:border-accent-blue/35",
                    type: "button"
                  }, [
                    createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                      createVNode("div", { class: "flex min-w-0 items-center gap-3" }, [
                        createVNode("div", { class: "relative grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5" }, [
                          createVNode("div", {
                            class: ["pointer-events-none absolute inset-0 rounded-2xl opacity-70 blur-xl", m.tone === "indigo" ? "bg-accent-indigo/25" : "bg-accent-blue/20"]
                          }, null, 2),
                          (openBlock(), createBlock(resolveDynamicComponent(m.icon), { class: "relative h-5 w-5 text-zinc-50" }))
                        ]),
                        createVNode("div", { class: "min-w-0" }, [
                          createVNode("p", { class: "truncate text-sm font-bold text-zinc-50" }, toDisplayString(m.title), 1),
                          createVNode("p", { class: "mt-0.5 text-xs text-zinc-500" }, toDisplayString(m.meta), 1)
                        ])
                      ]),
                      createVNode("div", { class: "flex items-center gap-3" }, [
                        createVNode("span", { class: "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300" }, toDisplayString(m.status), 1),
                        createVNode(unref(ChevronRight), { class: "h-4 w-4 text-zinc-600 transition-transform duration-200 group-hover/material:translate-x-0.5" })
                      ])
                    ])
                  ]);
                }), 64))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="lg:col-span-5">`);
      _push(ssrRenderComponent(GlassCard, { class: "p-6" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><h2 class="text-lg font-extrabold tracking-tight text-zinc-50"${_scopeId}>Recent Activity</h2><span class="text-xs font-semibold text-zinc-500"${_scopeId}>Live</span></div><div class="mt-4 space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(activity, (a) => {
              _push2(`<div class="group/activity rounded-2xl border border-white/10 bg-white/3 px-4 py-3 transition-all duration-200 hover:bg-white/5 hover:border-accent-indigo/35"${_scopeId}><div class="flex items-start gap-3"${_scopeId}><div class="mt-0.5 grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/5"${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(a.icon), { class: "h-4 w-4 text-zinc-50" }, null), _parent2, _scopeId);
              _push2(`</div><div class="min-w-0"${_scopeId}><p class="text-sm font-semibold text-zinc-200"${_scopeId}>${ssrInterpolate(a.title)}</p><p class="mt-1 text-xs text-zinc-500"${_scopeId}>${ssrInterpolate(a.detail)}</p></div></div><div class="mt-3 flex items-center justify-between"${_scopeId}><span class="text-xs text-zinc-600"${_scopeId}>${ssrInterpolate(a.time)}</span><span class="text-xs font-semibold text-zinc-400 transition-colors group-hover/activity:text-zinc-200"${_scopeId}> Open → </span></div></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("h2", { class: "text-lg font-extrabold tracking-tight text-zinc-50" }, "Recent Activity"),
                createVNode("span", { class: "text-xs font-semibold text-zinc-500" }, "Live")
              ]),
              createVNode("div", { class: "mt-4 space-y-2" }, [
                (openBlock(), createBlock(Fragment, null, renderList(activity, (a) => {
                  return createVNode("div", {
                    key: a.id,
                    class: "group/activity rounded-2xl border border-white/10 bg-white/3 px-4 py-3 transition-all duration-200 hover:bg-white/5 hover:border-accent-indigo/35"
                  }, [
                    createVNode("div", { class: "flex items-start gap-3" }, [
                      createVNode("div", { class: "mt-0.5 grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/5" }, [
                        (openBlock(), createBlock(resolveDynamicComponent(a.icon), { class: "h-4 w-4 text-zinc-50" }))
                      ]),
                      createVNode("div", { class: "min-w-0" }, [
                        createVNode("p", { class: "text-sm font-semibold text-zinc-200" }, toDisplayString(a.title), 1),
                        createVNode("p", { class: "mt-1 text-xs text-zinc-500" }, toDisplayString(a.detail), 1)
                      ])
                    ]),
                    createVNode("div", { class: "mt-3 flex items-center justify-between" }, [
                      createVNode("span", { class: "text-xs text-zinc-600" }, toDisplayString(a.time), 1),
                      createVNode("span", { class: "text-xs font-semibold text-zinc-400 transition-colors group-hover/activity:text-zinc-200" }, " Open → ")
                    ])
                  ]);
                }), 64))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="fixed bottom-6 right-6 z-50">`);
      _push(ssrRenderComponent(GlassCard, {
        class: "w-[320px] p-4",
        hover: false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-start justify-between gap-3"${_scopeId}><div class="min-w-0"${_scopeId}><p class="text-xs font-semibold text-zinc-500"${_scopeId}>Quick Action</p><p class="mt-1 text-sm font-extrabold tracking-tight text-zinc-50"${_scopeId}> Upload New Material </p><p class="mt-1 text-xs text-zinc-500"${_scopeId}> Drag &amp; drop nanti bisa ditambah. </p></div><div class="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 shadow-glow-blue"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Upload), { class: "h-5 w-5 text-zinc-50" }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="mt-4 grid grid-cols-2 gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(Button, {
              size: "sm",
              class: "w-full",
              onClick: ($event) => isUploadOpen.value = true
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Upload), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                  _push3(` Upload `);
                } else {
                  return [
                    createVNode(unref(Upload), { class: "h-4 w-4" }),
                    createTextVNode(" Upload ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(Button, {
              variant: "secondary",
              size: "sm",
              class: "w-full"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(FileText), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                  _push3(` Template `);
                } else {
                  return [
                    createVNode(unref(FileText), { class: "h-4 w-4" }),
                    createTextVNode(" Template ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                createVNode("div", { class: "min-w-0" }, [
                  createVNode("p", { class: "text-xs font-semibold text-zinc-500" }, "Quick Action"),
                  createVNode("p", { class: "mt-1 text-sm font-extrabold tracking-tight text-zinc-50" }, " Upload New Material "),
                  createVNode("p", { class: "mt-1 text-xs text-zinc-500" }, " Drag & drop nanti bisa ditambah. ")
                ]),
                createVNode("div", { class: "grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 shadow-glow-blue" }, [
                  createVNode(unref(Upload), { class: "h-5 w-5 text-zinc-50" })
                ])
              ]),
              createVNode("div", { class: "mt-4 grid grid-cols-2 gap-2" }, [
                createVNode(Button, {
                  size: "sm",
                  class: "w-full",
                  onClick: ($event) => isUploadOpen.value = true
                }, {
                  default: withCtx(() => [
                    createVNode(unref(Upload), { class: "h-4 w-4" }),
                    createTextVNode(" Upload ")
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(Button, {
                  variant: "secondary",
                  size: "sm",
                  class: "w-full"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(FileText), { class: "h-4 w-4" }),
                    createTextVNode(" Template ")
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(Dialog, {
        open: isUploadOpen.value,
        "onUpdate:open": ($event) => isUploadOpen.value = $event
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-start justify-between gap-4"${_scopeId}><div class="min-w-0"${_scopeId}><p class="text-xs font-semibold tracking-wide text-zinc-500"${_scopeId}>Upload</p><h3 class="mt-1 text-lg font-extrabold tracking-tight text-zinc-50"${_scopeId}> Upload New Material </h3><p class="mt-2 text-sm text-zinc-500"${_scopeId}> Prototype modal: fokus ke premium layout + interaction, bukan fungsional backend dulu. </p></div><button type="button" class="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/6"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(X), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            _push2(`</button></div><div class="mt-5 grid gap-3"${_scopeId}><div class="rounded-3xl border border-white/10 bg-white/5 p-4"${_scopeId}><p class="text-xs font-semibold text-zinc-300"${_scopeId}>Type</p><div class="mt-3 grid grid-cols-3 gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(Button, {
              size: "sm",
              class: ["w-full", uploadType.value === "video" ? "" : "opacity-80"],
              onClick: ($event) => uploadType.value = "video"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Video), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                  _push3(` Video `);
                } else {
                  return [
                    createVNode(unref(Video), { class: "h-4 w-4" }),
                    createTextVNode(" Video ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(Button, {
              variant: "secondary",
              size: "sm",
              class: ["w-full", uploadType.value === "reading" ? "" : "opacity-80"],
              onClick: ($event) => uploadType.value = "reading"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(FileText), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                  _push3(` Reading `);
                } else {
                  return [
                    createVNode(unref(FileText), { class: "h-4 w-4" }),
                    createTextVNode(" Reading ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(Button, {
              variant: "ghost",
              size: "sm",
              class: ["w-full", uploadType.value === "quiz" ? "" : "opacity-80"],
              onClick: ($event) => uploadType.value = "quiz"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(CheckCircle2), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                  _push3(` Quiz `);
                } else {
                  return [
                    createVNode(unref(CheckCircle2), { class: "h-4 w-4" }),
                    createTextVNode(" Quiz ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="rounded-3xl border border-white/10 bg-white/5 p-4"${_scopeId}><p class="text-xs font-semibold text-zinc-300"${_scopeId}>Title</p><div class="mt-3"${_scopeId}>`);
            _push2(ssrRenderComponent(Input, {
              modelValue: uploadTitle.value,
              "onUpdate:modelValue": ($event) => uploadTitle.value = $event,
              placeholder: "Contoh: Hukum Newton II — latihan konsep"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mt-3 flex items-center justify-between"${_scopeId}><p class="text-xs text-zinc-500"${_scopeId}>Tip: judul pendek, hasil belajar jelas.</p><span class="text-xs font-semibold text-zinc-500"${_scopeId}>${ssrInterpolate(uploadTitle.value.length)}/80</span></div></div><div class="flex items-center justify-end gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(Button, {
              variant: "ghost",
              size: "md",
              onClick: ($event) => isUploadOpen.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(Button, {
              size: "md",
              onClick: ($event) => isUploadOpen.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Upload), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                  _push3(` Create draft `);
                } else {
                  return [
                    createVNode(unref(Upload), { class: "h-4 w-4" }),
                    createTextVNode(" Create draft ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                createVNode("div", { class: "min-w-0" }, [
                  createVNode("p", { class: "text-xs font-semibold tracking-wide text-zinc-500" }, "Upload"),
                  createVNode("h3", { class: "mt-1 text-lg font-extrabold tracking-tight text-zinc-50" }, " Upload New Material "),
                  createVNode("p", { class: "mt-2 text-sm text-zinc-500" }, " Prototype modal: fokus ke premium layout + interaction, bukan fungsional backend dulu. ")
                ]),
                createVNode("button", {
                  type: "button",
                  class: "grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/6",
                  onClick: ($event) => isUploadOpen.value = false
                }, [
                  createVNode(unref(X), { class: "h-4 w-4" })
                ], 8, ["onClick"])
              ]),
              createVNode("div", { class: "mt-5 grid gap-3" }, [
                createVNode("div", { class: "rounded-3xl border border-white/10 bg-white/5 p-4" }, [
                  createVNode("p", { class: "text-xs font-semibold text-zinc-300" }, "Type"),
                  createVNode("div", { class: "mt-3 grid grid-cols-3 gap-2" }, [
                    createVNode(Button, {
                      size: "sm",
                      class: ["w-full", uploadType.value === "video" ? "" : "opacity-80"],
                      onClick: ($event) => uploadType.value = "video"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Video), { class: "h-4 w-4" }),
                        createTextVNode(" Video ")
                      ]),
                      _: 1
                    }, 8, ["class", "onClick"]),
                    createVNode(Button, {
                      variant: "secondary",
                      size: "sm",
                      class: ["w-full", uploadType.value === "reading" ? "" : "opacity-80"],
                      onClick: ($event) => uploadType.value = "reading"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(FileText), { class: "h-4 w-4" }),
                        createTextVNode(" Reading ")
                      ]),
                      _: 1
                    }, 8, ["class", "onClick"]),
                    createVNode(Button, {
                      variant: "ghost",
                      size: "sm",
                      class: ["w-full", uploadType.value === "quiz" ? "" : "opacity-80"],
                      onClick: ($event) => uploadType.value = "quiz"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(CheckCircle2), { class: "h-4 w-4" }),
                        createTextVNode(" Quiz ")
                      ]),
                      _: 1
                    }, 8, ["class", "onClick"])
                  ])
                ]),
                createVNode("div", { class: "rounded-3xl border border-white/10 bg-white/5 p-4" }, [
                  createVNode("p", { class: "text-xs font-semibold text-zinc-300" }, "Title"),
                  createVNode("div", { class: "mt-3" }, [
                    createVNode(Input, {
                      modelValue: uploadTitle.value,
                      "onUpdate:modelValue": ($event) => uploadTitle.value = $event,
                      placeholder: "Contoh: Hukum Newton II — latihan konsep"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "mt-3 flex items-center justify-between" }, [
                    createVNode("p", { class: "text-xs text-zinc-500" }, "Tip: judul pendek, hasil belajar jelas."),
                    createVNode("span", { class: "text-xs font-semibold text-zinc-500" }, toDisplayString(uploadTitle.value.length) + "/80", 1)
                  ])
                ]),
                createVNode("div", { class: "flex items-center justify-end gap-2" }, [
                  createVNode(Button, {
                    variant: "ghost",
                    size: "md",
                    onClick: ($event) => isUploadOpen.value = false
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Cancel ")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(Button, {
                    size: "md",
                    onClick: ($event) => isUploadOpen.value = false
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Upload), { class: "h-4 w-4" }),
                      createTextVNode(" Create draft ")
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/teacher/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DFvXH1Fg.mjs.map
