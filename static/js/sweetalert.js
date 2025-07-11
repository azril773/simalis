/*!
 * sweetalert2 v11.14.0
 * Released under the MIT License.
 */
!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : ((e =
        "undefined" != typeof globalThis ? globalThis : e || self).Sweetalert2 =
        t());
})(this, function () {
  "use strict";
  function e(e, t, n) {
    if ("function" == typeof e ? e === t : e.has(t))
      return arguments.length < 3 ? t : n;
    throw new TypeError("Private element is not present on this object");
  }
  function t(t, n) {
    return t.get(e(t, n));
  }
  function n(e, t, n) {
    (function (e, t) {
      if (t.has(e))
        throw new TypeError(
          "Cannot initialize the same private elements twice on an object"
        );
    })(e, t),
      t.set(e, n);
  }
  const o = {},
    i = (e) =>
      new Promise((t) => {
        if (!e) return t();
        const n = window.scrollX,
          i = window.scrollY;
        (o.restoreFocusTimeout = setTimeout(() => {
          o.previousActiveElement instanceof HTMLElement
            ? (o.previousActiveElement.focus(),
              (o.previousActiveElement = null))
            : document.body && document.body.focus(),
            t();
        }, 100)),
          window.scrollTo(n, i);
      }),
    s = "swal2-",
    r = [
      "container",
      "shown",
      "height-auto",
      "iosfix",
      "popup",
      "modal",
      "no-backdrop",
      "no-transition",
      "toast",
      "toast-shown",
      "show",
      "hide",
      "close",
      "title",
      "html-container",
      "actions",
      "confirm",
      "deny",
      "cancel",
      "default-outline",
      "footer",
      "icon",
      "icon-content",
      "image",
      "input",
      "file",
      "range",
      "select",
      "radio",
      "checkbox",
      "label",
      "textarea",
      "inputerror",
      "input-label",
      "validation-message",
      "progress-steps",
      "active-progress-step",
      "progress-step",
      "progress-step-line",
      "loader",
      "loading",
      "styled",
      "top",
      "top-start",
      "top-end",
      "top-left",
      "top-right",
      "center",
      "center-start",
      "center-end",
      "center-left",
      "center-right",
      "bottom",
      "bottom-start",
      "bottom-end",
      "bottom-left",
      "bottom-right",
      "grow-row",
      "grow-column",
      "grow-fullscreen",
      "rtl",
      "timer-progress-bar",
      "timer-progress-bar-container",
      "scrollbar-measure",
      "icon-success",
      "icon-warning",
      "icon-info",
      "icon-question",
      "icon-error",
    ].reduce((e, t) => ((e[t] = s + t), e), {}),
    a = ["success", "warning", "info", "question", "error"].reduce(
      (e, t) => ((e[t] = s + t), e),
      {}
    ),
    l = "SweetAlert2:",
    c = (e) => e.charAt(0).toUpperCase() + e.slice(1),
    u = (e) => {
      console.warn(`${l} ${"object" == typeof e ? e.join(" ") : e}`);
    },
    d = (e) => {
      console.error(`${l} ${e}`);
    },
    p = [],
    m = function (e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      var n;
      (n = `"${e}" is deprecated and will be removed in the next major release.${
        t ? ` Use "${t}" instead.` : ""
      }`),
        p.includes(n) || (p.push(n), u(n));
    },
    h = (e) => ("function" == typeof e ? e() : e),
    g = (e) => e && "function" == typeof e.toPromise,
    f = (e) => (g(e) ? e.toPromise() : Promise.resolve(e)),
    b = (e) => e && Promise.resolve(e) === e,
    y = () => document.body.querySelector(`.${r.container}`),
    w = (e) => {
      const t = y();
      return t ? t.querySelector(e) : null;
    },
    v = (e) => w(`.${e}`),
    C = () => v(r.popup),
    A = () => v(r.icon),
    k = () => v(r.title),
    E = () => v(r["html-container"]),
    B = () => v(r.image),
    $ = () => v(r["progress-steps"]),
    P = () => v(r["validation-message"]),
    x = () => w(`.${r.actions} .${r.confirm}`),
    T = () => w(`.${r.actions} .${r.cancel}`),
    L = () => w(`.${r.actions} .${r.deny}`),
    S = () => w(`.${r.loader}`),
    O = () => v(r.actions),
    M = () => v(r.footer),
    j = () => v(r["timer-progress-bar"]),
    H = () => v(r.close),
    I = () => {
      const e = C();
      if (!e) return [];
      const t = e.querySelectorAll(
          '[tabindex]:not([tabindex="-1"]):not([tabindex="0"])'
        ),
        n = Array.from(t).sort((e, t) => {
          const n = parseInt(e.getAttribute("tabindex") || "0"),
            o = parseInt(t.getAttribute("tabindex") || "0");
          return n > o ? 1 : n < o ? -1 : 0;
        }),
        o = e.querySelectorAll(
          '\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex="0"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n'
        ),
        i = Array.from(o).filter((e) => "-1" !== e.getAttribute("tabindex"));
      return [...new Set(n.concat(i))].filter((e) => ee(e));
    },
    D = () =>
      N(document.body, r.shown) &&
      !N(document.body, r["toast-shown"]) &&
      !N(document.body, r["no-backdrop"]),
    q = () => {
      const e = C();
      return !!e && N(e, r.toast);
    },
    V = (e, t) => {
      if (((e.textContent = ""), t)) {
        const n = new DOMParser().parseFromString(t, "text/html"),
          o = n.querySelector("head");
        o &&
          Array.from(o.childNodes).forEach((t) => {
            e.appendChild(t);
          });
        const i = n.querySelector("body");
        i &&
          Array.from(i.childNodes).forEach((t) => {
            t instanceof HTMLVideoElement || t instanceof HTMLAudioElement
              ? e.appendChild(t.cloneNode(!0))
              : e.appendChild(t);
          });
      }
    },
    N = (e, t) => {
      if (!t) return !1;
      const n = t.split(/\s+/);
      for (let t = 0; t < n.length; t++)
        if (!e.classList.contains(n[t])) return !1;
      return !0;
    },
    _ = (e, t, n) => {
      if (
        (((e, t) => {
          Array.from(e.classList).forEach((n) => {
            Object.values(r).includes(n) ||
              Object.values(a).includes(n) ||
              Object.values(t.showClass || {}).includes(n) ||
              e.classList.remove(n);
          });
        })(e, t),
        !t.customClass)
      )
        return;
      const o = t.customClass[n];
      o &&
        ("string" == typeof o || o.forEach
          ? z(e, o)
          : u(
              `Invalid type of customClass.${n}! Expected string or iterable object, got "${typeof o}"`
            ));
    },
    F = (e, t) => {
      if (!t) return null;
      switch (t) {
        case "select":
        case "textarea":
        case "file":
          return e.querySelector(`.${r.popup} > .${r[t]}`);
        case "checkbox":
          return e.querySelector(`.${r.popup} > .${r.checkbox} input`);
        case "radio":
          return (
            e.querySelector(`.${r.popup} > .${r.radio} input:checked`) ||
            e.querySelector(`.${r.popup} > .${r.radio} input:first-child`)
          );
        case "range":
          return e.querySelector(`.${r.popup} > .${r.range} input`);
        default:
          return e.querySelector(`.${r.popup} > .${r.input}`);
      }
    },
    R = (e) => {
      if ((e.focus(), "file" !== e.type)) {
        const t = e.value;
        (e.value = ""), (e.value = t);
      }
    },
    U = (e, t, n) => {
      e &&
        t &&
        ("string" == typeof t && (t = t.split(/\s+/).filter(Boolean)),
        t.forEach((t) => {
          Array.isArray(e)
            ? e.forEach((e) => {
                n ? e.classList.add(t) : e.classList.remove(t);
              })
            : n
            ? e.classList.add(t)
            : e.classList.remove(t);
        }));
    },
    z = (e, t) => {
      U(e, t, !0);
    },
    K = (e, t) => {
      U(e, t, !1);
    },
    W = (e, t) => {
      const n = Array.from(e.children);
      for (let e = 0; e < n.length; e++) {
        const o = n[e];
        if (o instanceof HTMLElement && N(o, t)) return o;
      }
    },
    Y = (e, t, n) => {
      n === `${parseInt(n)}` && (n = parseInt(n)),
        n || 0 === parseInt(n)
          ? e.style.setProperty(t, "number" == typeof n ? `${n}px` : n)
          : e.style.removeProperty(t);
    },
    Z = function (e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "flex";
      e && (e.style.display = t);
    },
    J = (e) => {
      e && (e.style.display = "none");
    },
    X = function (e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : "block";
      e &&
        new MutationObserver(() => {
          Q(e, e.innerHTML, t);
        }).observe(e, { childList: !0, subtree: !0 });
    },
    G = (e, t, n, o) => {
      const i = e.querySelector(t);
      i && i.style.setProperty(n, o);
    },
    Q = function (e, t) {
      t
        ? Z(
            e,
            arguments.length > 2 && void 0 !== arguments[2]
              ? arguments[2]
              : "flex"
          )
        : J(e);
    },
    ee = (e) =>
      !(!e || !(e.offsetWidth || e.offsetHeight || e.getClientRects().length)),
    te = (e) => !!(e.scrollHeight > e.clientHeight),
    ne = (e) => {
      const t = window.getComputedStyle(e),
        n = parseFloat(t.getPropertyValue("animation-duration") || "0"),
        o = parseFloat(t.getPropertyValue("transition-duration") || "0");
      return n > 0 || o > 0;
    },
    oe = function (e) {
      let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      const n = j();
      n &&
        ee(n) &&
        (t && ((n.style.transition = "none"), (n.style.width = "100%")),
        setTimeout(() => {
          (n.style.transition = `width ${e / 1e3}s linear`),
            (n.style.width = "0%");
        }, 10));
    },
    ie = () => "undefined" == typeof window || "undefined" == typeof document,
    se =
      `\n <div aria-labelledby="${r.title}" aria-describedby="${r["html-container"]}" class="${r.popup}" tabindex="-1">\n   <button type="button" class="${r.close}"></button>\n   <ul class="${r["progress-steps"]}"></ul>\n   <div class="${r.icon}"></div>\n   <img class="${r.image}" />\n   <h2 class="${r.title}" id="${r.title}"></h2>\n   <div class="${r["html-container"]}" id="${r["html-container"]}"></div>\n   <input class="${r.input}" id="${r.input}" />\n   <input type="file" class="${r.file}" />\n   <div class="${r.range}">\n     <input type="range" />\n     <output></output>\n   </div>\n   <select class="${r.select}" id="${r.select}"></select>\n   <div class="${r.radio}"></div>\n   <label class="${r.checkbox}">\n     <input type="checkbox" id="${r.checkbox}" />\n     <span class="${r.label}"></span>\n   </label>\n   <textarea class="${r.textarea}" id="${r.textarea}"></textarea>\n   <div class="${r["validation-message"]}" id="${r["validation-message"]}"></div>\n   <div class="${r.actions}">\n     <div class="${r.loader}"></div>\n     <button type="button" class="${r.confirm}"></button>\n     <button type="button" class="${r.deny}"></button>\n     <button type="button" class="${r.cancel}"></button>\n   </div>\n   <div class="${r.footer}"></div>\n   <div class="${r["timer-progress-bar-container"]}">\n     <div class="${r["timer-progress-bar"]}"></div>\n   </div>\n </div>\n`.replace(
        /(^|\n)\s*/g,
        ""
      ),
    re = () => {
      o.currentInstance.resetValidationMessage();
    },
    ae = (e) => {
      const t = (() => {
        const e = y();
        return (
          !!e &&
          (e.remove(),
          K(
            [document.documentElement, document.body],
            [r["no-backdrop"], r["toast-shown"], r["has-column"]]
          ),
          !0)
        );
      })();
      if (ie()) return void d("SweetAlert2 requires document to initialize");
      const n = document.createElement("div");
      (n.className = r.container), t && z(n, r["no-transition"]), V(n, se);
      const o =
        "string" == typeof (i = e.target) ? document.querySelector(i) : i;
      var i;
      o.appendChild(n),
        ((e) => {
          const t = C();
          t.setAttribute("role", e.toast ? "alert" : "dialog"),
            t.setAttribute("aria-live", e.toast ? "polite" : "assertive"),
            e.toast || t.setAttribute("aria-modal", "true");
        })(e),
        ((e) => {
          "rtl" === window.getComputedStyle(e).direction && z(y(), r.rtl);
        })(o),
        (() => {
          const e = C(),
            t = W(e, r.input),
            n = W(e, r.file),
            o = e.querySelector(`.${r.range} input`),
            i = e.querySelector(`.${r.range} output`),
            s = W(e, r.select),
            a = e.querySelector(`.${r.checkbox} input`),
            l = W(e, r.textarea);
          (t.oninput = re),
            (n.onchange = re),
            (s.onchange = re),
            (a.onchange = re),
            (l.oninput = re),
            (o.oninput = () => {
              re(), (i.value = o.value);
            }),
            (o.onchange = () => {
              re(), (i.value = o.value);
            });
        })();
    },
    le = (e, t) => {
      e instanceof HTMLElement
        ? t.appendChild(e)
        : "object" == typeof e
        ? ce(e, t)
        : e && V(t, e);
    },
    ce = (e, t) => {
      e.jquery ? ue(t, e) : V(t, e.toString());
    },
    ue = (e, t) => {
      if (((e.textContent = ""), 0 in t))
        for (let n = 0; n in t; n++) e.appendChild(t[n].cloneNode(!0));
      else e.appendChild(t.cloneNode(!0));
    },
    de = (() => {
      if (ie()) return !1;
      const e = document.createElement("div");
      return void 0 !== e.style.webkitAnimation
        ? "webkitAnimationEnd"
        : void 0 !== e.style.animation && "animationend";
    })(),
    pe = (e, t) => {
      const n = O(),
        o = S();
      n &&
        o &&
        (t.showConfirmButton || t.showDenyButton || t.showCancelButton
          ? Z(n)
          : J(n),
        _(n, t, "actions"),
        (function (e, t, n) {
          const o = x(),
            i = L(),
            s = T();
          if (!o || !i || !s) return;
          me(o, "confirm", n),
            me(i, "deny", n),
            me(s, "cancel", n),
            (function (e, t, n, o) {
              if (!o.buttonsStyling) return void K([e, t, n], r.styled);
              z([e, t, n], r.styled),
                o.confirmButtonColor &&
                  ((e.style.backgroundColor = o.confirmButtonColor),
                  z(e, r["default-outline"]));
              o.denyButtonColor &&
                ((t.style.backgroundColor = o.denyButtonColor),
                z(t, r["default-outline"]));
              o.cancelButtonColor &&
                ((n.style.backgroundColor = o.cancelButtonColor),
                z(n, r["default-outline"]));
            })(o, i, s, n),
            n.reverseButtons &&
              (n.toast
                ? (e.insertBefore(s, o), e.insertBefore(i, o))
                : (e.insertBefore(s, t),
                  e.insertBefore(i, t),
                  e.insertBefore(o, t)));
        })(n, o, t),
        V(o, t.loaderHtml || ""),
        _(o, t, "loader"));
    };
  function me(e, t, n) {
    const o = c(t);
    Q(e, n[`show${o}Button`], "inline-block"),
      V(e, n[`${t}ButtonText`] || ""),
      e.setAttribute("aria-label", n[`${t}ButtonAriaLabel`] || ""),
      (e.className = r[t]),
      _(e, n, `${t}Button`);
  }
  const he = (e, t) => {
    const n = y();
    n &&
      (!(function (e, t) {
        "string" == typeof t
          ? (e.style.background = t)
          : t || z([document.documentElement, document.body], r["no-backdrop"]);
      })(n, t.backdrop),
      (function (e, t) {
        if (!t) return;
        t in r
          ? z(e, r[t])
          : (u('The "position" parameter is not valid, defaulting to "center"'),
            z(e, r.center));
      })(n, t.position),
      (function (e, t) {
        if (!t) return;
        z(e, r[`grow-${t}`]);
      })(n, t.grow),
      _(n, t, "container"));
  };
  var ge = { innerParams: new WeakMap(), domCache: new WeakMap() };
  const fe = [
      "input",
      "file",
      "range",
      "select",
      "radio",
      "checkbox",
      "textarea",
    ],
    be = (e) => {
      if (!e.input) return;
      if (!Ee[e.input])
        return void d(
          `Unexpected type of input! Expected ${Object.keys(Ee).join(
            " | "
          )}, got "${e.input}"`
        );
      const t = Ae(e.input);
      if (!t) return;
      const n = Ee[e.input](t, e);
      Z(t),
        e.inputAutoFocus &&
          setTimeout(() => {
            R(n);
          });
    },
    ye = (e, t) => {
      const n = C();
      if (!n) return;
      const o = F(n, e);
      if (o) {
        ((e) => {
          for (let t = 0; t < e.attributes.length; t++) {
            const n = e.attributes[t].name;
            ["id", "type", "value", "style"].includes(n) ||
              e.removeAttribute(n);
          }
        })(o);
        for (const e in t) o.setAttribute(e, t[e]);
      }
    },
    we = (e) => {
      if (!e.input) return;
      const t = Ae(e.input);
      t && _(t, e, "input");
    },
    ve = (e, t) => {
      !e.placeholder &&
        t.inputPlaceholder &&
        (e.placeholder = t.inputPlaceholder);
    },
    Ce = (e, t, n) => {
      if (n.inputLabel) {
        const o = document.createElement("label"),
          i = r["input-label"];
        o.setAttribute("for", e.id),
          (o.className = i),
          "object" == typeof n.customClass && z(o, n.customClass.inputLabel),
          (o.innerText = n.inputLabel),
          t.insertAdjacentElement("beforebegin", o);
      }
    },
    Ae = (e) => {
      const t = C();
      if (t) return W(t, r[e] || r.input);
    },
    ke = (e, t) => {
      ["string", "number"].includes(typeof t)
        ? (e.value = `${t}`)
        : b(t) ||
          u(
            `Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof t}"`
          );
    },
    Ee = {};
  (Ee.text =
    Ee.email =
    Ee.password =
    Ee.number =
    Ee.tel =
    Ee.url =
    Ee.search =
    Ee.date =
    Ee["datetime-local"] =
    Ee.time =
    Ee.week =
    Ee.month =
      (e, t) => (
        ke(e, t.inputValue), Ce(e, e, t), ve(e, t), (e.type = t.input), e
      )),
    (Ee.file = (e, t) => (Ce(e, e, t), ve(e, t), e)),
    (Ee.range = (e, t) => {
      const n = e.querySelector("input"),
        o = e.querySelector("output");
      return (
        ke(n, t.inputValue),
        (n.type = t.input),
        ke(o, t.inputValue),
        Ce(n, e, t),
        e
      );
    }),
    (Ee.select = (e, t) => {
      if (((e.textContent = ""), t.inputPlaceholder)) {
        const n = document.createElement("option");
        V(n, t.inputPlaceholder),
          (n.value = ""),
          (n.disabled = !0),
          (n.selected = !0),
          e.appendChild(n);
      }
      return Ce(e, e, t), e;
    }),
    (Ee.radio = (e) => ((e.textContent = ""), e)),
    (Ee.checkbox = (e, t) => {
      const n = F(C(), "checkbox");
      (n.value = "1"), (n.checked = Boolean(t.inputValue));
      const o = e.querySelector("span");
      return V(o, t.inputPlaceholder || t.inputLabel), n;
    }),
    (Ee.textarea = (e, t) => {
      ke(e, t.inputValue), ve(e, t), Ce(e, e, t);
      return (
        setTimeout(() => {
          if ("MutationObserver" in window) {
            const n = parseInt(window.getComputedStyle(C()).width);
            new MutationObserver(() => {
              if (!document.body.contains(e)) return;
              const o =
                e.offsetWidth +
                ((i = e),
                parseInt(window.getComputedStyle(i).marginLeft) +
                  parseInt(window.getComputedStyle(i).marginRight));
              var i;
              o > n ? (C().style.width = `${o}px`) : Y(C(), "width", t.width);
            }).observe(e, { attributes: !0, attributeFilter: ["style"] });
          }
        }),
        e
      );
    });
  const Be = (e, t) => {
      const n = E();
      n &&
        (X(n),
        _(n, t, "htmlContainer"),
        t.html
          ? (le(t.html, n), Z(n, "block"))
          : t.text
          ? ((n.textContent = t.text), Z(n, "block"))
          : J(n),
        ((e, t) => {
          const n = C();
          if (!n) return;
          const o = ge.innerParams.get(e),
            i = !o || t.input !== o.input;
          fe.forEach((e) => {
            const o = W(n, r[e]);
            o && (ye(e, t.inputAttributes), (o.className = r[e]), i && J(o));
          }),
            t.input && (i && be(t), we(t));
        })(e, t));
    },
    $e = (e, t) => {
      for (const [n, o] of Object.entries(a)) t.icon !== n && K(e, o);
      z(e, t.icon && a[t.icon]), Te(e, t), Pe(), _(e, t, "icon");
    },
    Pe = () => {
      const e = C();
      if (!e) return;
      const t = window.getComputedStyle(e).getPropertyValue("background-color"),
        n = e.querySelectorAll(
          "[class^=swal2-success-circular-line], .swal2-success-fix"
        );
      for (let e = 0; e < n.length; e++) n[e].style.backgroundColor = t;
    },
    xe = (e, t) => {
      if (!t.icon && !t.iconHtml) return;
      let n = e.innerHTML,
        o = "";
      if (t.iconHtml) o = Le(t.iconHtml);
      else if ("success" === t.icon)
        (o =
          '\n  <div class="swal2-success-circular-line-left"></div>\n  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>\n  <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>\n  <div class="swal2-success-circular-line-right"></div>\n'),
          (n = n.replace(/ style=".*?"/g, ""));
      else if ("error" === t.icon)
        o =
          '\n  <span class="swal2-x-mark">\n    <span class="swal2-x-mark-line-left"></span>\n    <span class="swal2-x-mark-line-right"></span>\n  </span>\n';
      else if (t.icon) {
        o = Le({ question: "?", warning: "!", info: "i" }[t.icon]);
      }
      n.trim() !== o.trim() && V(e, o);
    },
    Te = (e, t) => {
      if (t.iconColor) {
        (e.style.color = t.iconColor), (e.style.borderColor = t.iconColor);
        for (const n of [
          ".swal2-success-line-tip",
          ".swal2-success-line-long",
          ".swal2-x-mark-line-left",
          ".swal2-x-mark-line-right",
        ])
          G(e, n, "background-color", t.iconColor);
        G(e, ".swal2-success-ring", "border-color", t.iconColor);
      }
    },
    Le = (e) => `<div class="${r["icon-content"]}">${e}</div>`,
    Se = (e, t) => {
      const n = t.showClass || {};
      (e.className = `${r.popup} ${ee(e) ? n.popup : ""}`),
        t.toast
          ? (z([document.documentElement, document.body], r["toast-shown"]),
            z(e, r.toast))
          : z(e, r.modal),
        _(e, t, "popup"),
        "string" == typeof t.customClass && z(e, t.customClass),
        t.icon && z(e, r[`icon-${t.icon}`]);
    },
    Oe = (e) => {
      const t = document.createElement("li");
      return z(t, r["progress-step"]), V(t, e), t;
    },
    Me = (e) => {
      const t = document.createElement("li");
      return (
        z(t, r["progress-step-line"]),
        e.progressStepsDistance && Y(t, "width", e.progressStepsDistance),
        t
      );
    },
    je = (e, t) => {
      ((e, t) => {
        const n = y(),
          o = C();
        if (n && o) {
          if (t.toast) {
            Y(n, "width", t.width), (o.style.width = "100%");
            const e = S();
            e && o.insertBefore(e, A());
          } else Y(o, "width", t.width);
          Y(o, "padding", t.padding),
            t.color && (o.style.color = t.color),
            t.background && (o.style.background = t.background),
            J(P()),
            Se(o, t);
        }
      })(0, t),
        he(0, t),
        ((e, t) => {
          const n = $();
          if (!n) return;
          const { progressSteps: o, currentProgressStep: i } = t;
          o && 0 !== o.length && void 0 !== i
            ? (Z(n),
              (n.textContent = ""),
              i >= o.length &&
                u(
                  "Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)"
                ),
              o.forEach((e, s) => {
                const a = Oe(e);
                if (
                  (n.appendChild(a),
                  s === i && z(a, r["active-progress-step"]),
                  s !== o.length - 1)
                ) {
                  const e = Me(t);
                  n.appendChild(e);
                }
              }))
            : J(n);
        })(0, t),
        ((e, t) => {
          const n = ge.innerParams.get(e),
            o = A();
          if (o) {
            if (n && t.icon === n.icon) return xe(o, t), void $e(o, t);
            if (t.icon || t.iconHtml) {
              if (t.icon && -1 === Object.keys(a).indexOf(t.icon))
                return (
                  d(
                    `Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${t.icon}"`
                  ),
                  void J(o)
                );
              Z(o), xe(o, t), $e(o, t), z(o, t.showClass && t.showClass.icon);
            } else J(o);
          }
        })(e, t),
        ((e, t) => {
          const n = B();
          n &&
            (t.imageUrl
              ? (Z(n, ""),
                n.setAttribute("src", t.imageUrl),
                n.setAttribute("alt", t.imageAlt || ""),
                Y(n, "width", t.imageWidth),
                Y(n, "height", t.imageHeight),
                (n.className = r.image),
                _(n, t, "image"))
              : J(n));
        })(0, t),
        ((e, t) => {
          const n = k();
          n &&
            (X(n),
            Q(n, t.title || t.titleText, "block"),
            t.title && le(t.title, n),
            t.titleText && (n.innerText = t.titleText),
            _(n, t, "title"));
        })(0, t),
        ((e, t) => {
          const n = H();
          n &&
            (V(n, t.closeButtonHtml || ""),
            _(n, t, "closeButton"),
            Q(n, t.showCloseButton),
            n.setAttribute("aria-label", t.closeButtonAriaLabel || ""));
        })(0, t),
        Be(e, t),
        pe(0, t),
        ((e, t) => {
          const n = M();
          n &&
            (X(n),
            Q(n, t.footer, "block"),
            t.footer && le(t.footer, n),
            _(n, t, "footer"));
        })(0, t);
      const n = C();
      "function" == typeof t.didRender && n && t.didRender(n),
        o.eventEmitter.emit("didRender", n);
    },
    He = () => {
      var e;
      return null === (e = x()) || void 0 === e ? void 0 : e.click();
    },
    Ie = Object.freeze({
      cancel: "cancel",
      backdrop: "backdrop",
      close: "close",
      esc: "esc",
      timer: "timer",
    }),
    De = (e) => {
      e.keydownTarget &&
        e.keydownHandlerAdded &&
        (e.keydownTarget.removeEventListener("keydown", e.keydownHandler, {
          capture: e.keydownListenerCapture,
        }),
        (e.keydownHandlerAdded = !1));
    },
    qe = (e, t) => {
      var n;
      const o = I();
      if (o.length)
        return (
          (e += t) === o.length ? (e = 0) : -1 === e && (e = o.length - 1),
          void o[e].focus()
        );
      null === (n = C()) || void 0 === n || n.focus();
    },
    Ve = ["ArrowRight", "ArrowDown"],
    Ne = ["ArrowLeft", "ArrowUp"],
    _e = (e, t, n) => {
      e &&
        (t.isComposing ||
          229 === t.keyCode ||
          (e.stopKeydownPropagation && t.stopPropagation(),
          "Enter" === t.key
            ? Fe(t, e)
            : "Tab" === t.key
            ? Re(t)
            : [...Ve, ...Ne].includes(t.key)
            ? Ue(t.key)
            : "Escape" === t.key && ze(t, e, n)));
    },
    Fe = (e, t) => {
      if (!h(t.allowEnterKey)) return;
      const n = F(C(), t.input);
      if (
        e.target &&
        n &&
        e.target instanceof HTMLElement &&
        e.target.outerHTML === n.outerHTML
      ) {
        if (["textarea", "file"].includes(t.input)) return;
        He(), e.preventDefault();
      }
    },
    Re = (e) => {
      const t = e.target,
        n = I();
      let o = -1;
      for (let e = 0; e < n.length; e++)
        if (t === n[e]) {
          o = e;
          break;
        }
      e.shiftKey ? qe(o, -1) : qe(o, 1),
        e.stopPropagation(),
        e.preventDefault();
    },
    Ue = (e) => {
      const t = O(),
        n = x(),
        o = L(),
        i = T();
      if (!(t && n && o && i)) return;
      const s = [n, o, i];
      if (
        document.activeElement instanceof HTMLElement &&
        !s.includes(document.activeElement)
      )
        return;
      const r = Ve.includes(e)
        ? "nextElementSibling"
        : "previousElementSibling";
      let a = document.activeElement;
      if (a) {
        for (let e = 0; e < t.children.length; e++) {
          if (((a = a[r]), !a)) return;
          if (a instanceof HTMLButtonElement && ee(a)) break;
        }
        a instanceof HTMLButtonElement && a.focus();
      }
    },
    ze = (e, t, n) => {
      h(t.allowEscapeKey) && (e.preventDefault(), n(Ie.esc));
    };
  var Ke = {
    swalPromiseResolve: new WeakMap(),
    swalPromiseReject: new WeakMap(),
  };
  const We = () => {
      Array.from(document.body.children).forEach((e) => {
        e.hasAttribute("data-previous-aria-hidden")
          ? (e.setAttribute(
              "aria-hidden",
              e.getAttribute("data-previous-aria-hidden") || ""
            ),
            e.removeAttribute("data-previous-aria-hidden"))
          : e.removeAttribute("aria-hidden");
      });
    },
    Ye = "undefined" != typeof window && !!window.GestureEvent,
    Ze = () => {
      const e = y();
      if (!e) return;
      let t;
      (e.ontouchstart = (e) => {
        t = Je(e);
      }),
        (e.ontouchmove = (e) => {
          t && (e.preventDefault(), e.stopPropagation());
        });
    },
    Je = (e) => {
      const t = e.target,
        n = y(),
        o = E();
      return (
        !(!n || !o) &&
        !Xe(e) &&
        !Ge(e) &&
        (t === n ||
          (!te(n) &&
            t instanceof HTMLElement &&
            "INPUT" !== t.tagName &&
            "TEXTAREA" !== t.tagName &&
            (!te(o) || !o.contains(t))))
      );
    },
    Xe = (e) =>
      e.touches && e.touches.length && "stylus" === e.touches[0].touchType,
    Ge = (e) => e.touches && e.touches.length > 1;
  let Qe = null;
  const et = (e) => {
    null === Qe &&
      (document.body.scrollHeight > window.innerHeight || "scroll" === e) &&
      ((Qe = parseInt(
        window.getComputedStyle(document.body).getPropertyValue("padding-right")
      )),
      (document.body.style.paddingRight = `${
        Qe +
        (() => {
          const e = document.createElement("div");
          (e.className = r["scrollbar-measure"]), document.body.appendChild(e);
          const t = e.getBoundingClientRect().width - e.clientWidth;
          return document.body.removeChild(e), t;
        })()
      }px`));
  };
  function tt(e, t, n, s) {
    q() ? ct(e, s) : (i(n).then(() => ct(e, s)), De(o)),
      Ye
        ? (t.setAttribute("style", "display:none !important"),
          t.removeAttribute("class"),
          (t.innerHTML = ""))
        : t.remove(),
      D() &&
        (null !== Qe &&
          ((document.body.style.paddingRight = `${Qe}px`), (Qe = null)),
        (() => {
          if (N(document.body, r.iosfix)) {
            const e = parseInt(document.body.style.top, 10);
            K(document.body, r.iosfix),
              (document.body.style.top = ""),
              (document.body.scrollTop = -1 * e);
          }
        })(),
        We()),
      K(
        [document.documentElement, document.body],
        [r.shown, r["height-auto"], r["no-backdrop"], r["toast-shown"]]
      );
  }
  function nt(e) {
    e = rt(e);
    const t = Ke.swalPromiseResolve.get(this),
      n = ot(this);
    this.isAwaitingPromise ? e.isDismissed || (st(this), t(e)) : n && t(e);
  }
  const ot = (e) => {
    const t = C();
    if (!t) return !1;
    const n = ge.innerParams.get(e);
    if (!n || N(t, n.hideClass.popup)) return !1;
    K(t, n.showClass.popup), z(t, n.hideClass.popup);
    const o = y();
    return (
      K(o, n.showClass.backdrop), z(o, n.hideClass.backdrop), at(e, t, n), !0
    );
  };
  function it(e) {
    const t = Ke.swalPromiseReject.get(this);
    st(this), t && t(e);
  }
  const st = (e) => {
      e.isAwaitingPromise &&
        (delete e.isAwaitingPromise, ge.innerParams.get(e) || e._destroy());
    },
    rt = (e) =>
      void 0 === e
        ? { isConfirmed: !1, isDenied: !1, isDismissed: !0 }
        : Object.assign({ isConfirmed: !1, isDenied: !1, isDismissed: !1 }, e),
    at = (e, t, n) => {
      const i = y(),
        s = de && ne(t);
      "function" == typeof n.willClose && n.willClose(t),
        o.eventEmitter.emit("willClose", t),
        s
          ? lt(e, t, i, n.returnFocus, n.didClose)
          : tt(e, i, n.returnFocus, n.didClose);
    },
    lt = (e, t, n, i, s) => {
      de &&
        ((o.swalCloseEventFinishedCallback = tt.bind(null, e, n, i, s)),
        t.addEventListener(de, function (e) {
          e.target === t &&
            (o.swalCloseEventFinishedCallback(),
            delete o.swalCloseEventFinishedCallback);
        }));
    },
    ct = (e, t) => {
      setTimeout(() => {
        "function" == typeof t && t.bind(e.params)(),
          o.eventEmitter.emit("didClose"),
          e._destroy && e._destroy();
      });
    },
    ut = (e) => {
      let t = C();
      if ((t || new Fn(), (t = C()), !t)) return;
      const n = S();
      q() ? J(A()) : dt(t, e),
        Z(n),
        t.setAttribute("data-loading", "true"),
        t.setAttribute("aria-busy", "true"),
        t.focus();
    },
    dt = (e, t) => {
      const n = O(),
        o = S();
      n &&
        o &&
        (!t && ee(x()) && (t = x()),
        Z(n),
        t &&
          (J(t),
          o.setAttribute("data-button-to-replace", t.className),
          n.insertBefore(o, t)),
        z([e, n], r.loading));
    },
    pt = (e) => (e.checked ? 1 : 0),
    mt = (e) => (e.checked ? e.value : null),
    ht = (e) =>
      e.files && e.files.length
        ? null !== e.getAttribute("multiple")
          ? e.files
          : e.files[0]
        : null,
    gt = (e, t) => {
      const n = C();
      if (!n) return;
      const o = (e) => {
        "select" === t.input
          ? (function (e, t, n) {
              const o = W(e, r.select);
              if (!o) return;
              const i = (e, t, o) => {
                const i = document.createElement("option");
                (i.value = o),
                  V(i, t),
                  (i.selected = yt(o, n.inputValue)),
                  e.appendChild(i);
              };
              t.forEach((e) => {
                const t = e[0],
                  n = e[1];
                if (Array.isArray(n)) {
                  const e = document.createElement("optgroup");
                  (e.label = t),
                    (e.disabled = !1),
                    o.appendChild(e),
                    n.forEach((t) => i(e, t[1], t[0]));
                } else i(o, n, t);
              }),
                o.focus();
            })(n, bt(e), t)
          : "radio" === t.input &&
            (function (e, t, n) {
              const o = W(e, r.radio);
              if (!o) return;
              t.forEach((e) => {
                const t = e[0],
                  i = e[1],
                  s = document.createElement("input"),
                  a = document.createElement("label");
                (s.type = "radio"),
                  (s.name = r.radio),
                  (s.value = t),
                  yt(t, n.inputValue) && (s.checked = !0);
                const l = document.createElement("span");
                V(l, i),
                  (l.className = r.label),
                  a.appendChild(s),
                  a.appendChild(l),
                  o.appendChild(a);
              });
              const i = o.querySelectorAll("input");
              i.length && i[0].focus();
            })(n, bt(e), t);
      };
      g(t.inputOptions) || b(t.inputOptions)
        ? (ut(x()),
          f(t.inputOptions).then((t) => {
            e.hideLoading(), o(t);
          }))
        : "object" == typeof t.inputOptions
        ? o(t.inputOptions)
        : d(
            "Unexpected type of inputOptions! Expected object, Map or Promise, got " +
              typeof t.inputOptions
          );
    },
    ft = (e, t) => {
      const n = e.getInput();
      n &&
        (J(n),
        f(t.inputValue)
          .then((o) => {
            (n.value = "number" === t.input ? `${parseFloat(o) || 0}` : `${o}`),
              Z(n),
              n.focus(),
              e.hideLoading();
          })
          .catch((t) => {
            d(`Error in inputValue promise: ${t}`),
              (n.value = ""),
              Z(n),
              n.focus(),
              e.hideLoading();
          }));
    };
  const bt = (e) => {
      const t = [];
      return (
        e instanceof Map
          ? e.forEach((e, n) => {
              let o = e;
              "object" == typeof o && (o = bt(o)), t.push([n, o]);
            })
          : Object.keys(e).forEach((n) => {
              let o = e[n];
              "object" == typeof o && (o = bt(o)), t.push([n, o]);
            }),
        t
      );
    },
    yt = (e, t) => !!t && t.toString() === e.toString(),
    wt = (e, t) => {
      const n = ge.innerParams.get(e);
      if (!n.input)
        return void d(
          `The "input" parameter is needed to be set when using returnInputValueOn${c(
            t
          )}`
        );
      const o = e.getInput(),
        i = ((e, t) => {
          const n = e.getInput();
          if (!n) return null;
          switch (t.input) {
            case "checkbox":
              return pt(n);
            case "radio":
              return mt(n);
            case "file":
              return ht(n);
            default:
              return t.inputAutoTrim ? n.value.trim() : n.value;
          }
        })(e, n);
      n.inputValidator
        ? vt(e, i, t)
        : o && !o.checkValidity()
        ? (e.enableButtons(),
          e.showValidationMessage(n.validationMessage || o.validationMessage))
        : "deny" === t
        ? Ct(e, i)
        : Et(e, i);
    },
    vt = (e, t, n) => {
      const o = ge.innerParams.get(e);
      e.disableInput();
      Promise.resolve()
        .then(() => f(o.inputValidator(t, o.validationMessage)))
        .then((o) => {
          e.enableButtons(),
            e.enableInput(),
            o ? e.showValidationMessage(o) : "deny" === n ? Ct(e, t) : Et(e, t);
        });
    },
    Ct = (e, t) => {
      const n = ge.innerParams.get(e || void 0);
      if ((n.showLoaderOnDeny && ut(L()), n.preDeny)) {
        e.isAwaitingPromise = !0;
        Promise.resolve()
          .then(() => f(n.preDeny(t, n.validationMessage)))
          .then((n) => {
            !1 === n
              ? (e.hideLoading(), st(e))
              : e.close({ isDenied: !0, value: void 0 === n ? t : n });
          })
          .catch((t) => kt(e || void 0, t));
      } else e.close({ isDenied: !0, value: t });
    },
    At = (e, t) => {
      e.close({ isConfirmed: !0, value: t });
    },
    kt = (e, t) => {
      e.rejectPromise(t);
    },
    Et = (e, t) => {
      const n = ge.innerParams.get(e || void 0);
      if ((n.showLoaderOnConfirm && ut(), n.preConfirm)) {
        e.resetValidationMessage(), (e.isAwaitingPromise = !0);
        Promise.resolve()
          .then(() => f(n.preConfirm(t, n.validationMessage)))
          .then((n) => {
            ee(P()) || !1 === n
              ? (e.hideLoading(), st(e))
              : At(e, void 0 === n ? t : n);
          })
          .catch((t) => kt(e || void 0, t));
      } else At(e, t);
    };
  function Bt() {
    const e = ge.innerParams.get(this);
    if (!e) return;
    const t = ge.domCache.get(this);
    J(t.loader),
      q() ? e.icon && Z(A()) : $t(t),
      K([t.popup, t.actions], r.loading),
      t.popup.removeAttribute("aria-busy"),
      t.popup.removeAttribute("data-loading"),
      (t.confirmButton.disabled = !1),
      (t.denyButton.disabled = !1),
      (t.cancelButton.disabled = !1);
  }
  const $t = (e) => {
    const t = e.popup.getElementsByClassName(
      e.loader.getAttribute("data-button-to-replace")
    );
    t.length
      ? Z(t[0], "inline-block")
      : ee(x()) || ee(L()) || ee(T()) || J(e.actions);
  };
  function Pt() {
    const e = ge.innerParams.get(this),
      t = ge.domCache.get(this);
    return t ? F(t.popup, e.input) : null;
  }
  function xt(e, t, n) {
    const o = ge.domCache.get(e);
    t.forEach((e) => {
      o[e].disabled = n;
    });
  }
  function Tt(e, t) {
    const n = C();
    if (n && e)
      if ("radio" === e.type) {
        const e = n.querySelectorAll(`[name="${r.radio}"]`);
        for (let n = 0; n < e.length; n++) e[n].disabled = t;
      } else e.disabled = t;
  }
  function Lt() {
    xt(this, ["confirmButton", "denyButton", "cancelButton"], !1);
  }
  function St() {
    xt(this, ["confirmButton", "denyButton", "cancelButton"], !0);
  }
  function Ot() {
    Tt(this.getInput(), !1);
  }
  function Mt() {
    Tt(this.getInput(), !0);
  }
  function jt(e) {
    const t = ge.domCache.get(this),
      n = ge.innerParams.get(this);
    V(t.validationMessage, e),
      (t.validationMessage.className = r["validation-message"]),
      n.customClass &&
        n.customClass.validationMessage &&
        z(t.validationMessage, n.customClass.validationMessage),
      Z(t.validationMessage);
    const o = this.getInput();
    o &&
      (o.setAttribute("aria-invalid", "true"),
      o.setAttribute("aria-describedby", r["validation-message"]),
      R(o),
      z(o, r.inputerror));
  }
  function Ht() {
    const e = ge.domCache.get(this);
    e.validationMessage && J(e.validationMessage);
    const t = this.getInput();
    t &&
      (t.removeAttribute("aria-invalid"),
      t.removeAttribute("aria-describedby"),
      K(t, r.inputerror));
  }
  const It = {
      title: "",
      titleText: "",
      text: "",
      html: "",
      footer: "",
      icon: void 0,
      iconColor: void 0,
      iconHtml: void 0,
      template: void 0,
      toast: !1,
      animation: !0,
      showClass: {
        popup: "swal2-show",
        backdrop: "swal2-backdrop-show",
        icon: "swal2-icon-show",
      },
      hideClass: {
        popup: "swal2-hide",
        backdrop: "swal2-backdrop-hide",
        icon: "swal2-icon-hide",
      },
      customClass: {},
      target: "body",
      color: void 0,
      backdrop: !0,
      heightAuto: !0,
      allowOutsideClick: !0,
      allowEscapeKey: !0,
      allowEnterKey: !0,
      stopKeydownPropagation: !0,
      keydownListenerCapture: !1,
      showConfirmButton: !0,
      showDenyButton: !1,
      showCancelButton: !1,
      preConfirm: void 0,
      preDeny: void 0,
      confirmButtonText: "OK",
      confirmButtonAriaLabel: "",
      confirmButtonColor: void 0,
      denyButtonText: "No",
      denyButtonAriaLabel: "",
      denyButtonColor: void 0,
      cancelButtonText: "Cancel",
      cancelButtonAriaLabel: "",
      cancelButtonColor: void 0,
      buttonsStyling: !0,
      reverseButtons: !1,
      focusConfirm: !0,
      focusDeny: !1,
      focusCancel: !1,
      returnFocus: !0,
      showCloseButton: !1,
      closeButtonHtml: "&times;",
      closeButtonAriaLabel: "Close this dialog",
      loaderHtml: "",
      showLoaderOnConfirm: !1,
      showLoaderOnDeny: !1,
      imageUrl: void 0,
      imageWidth: void 0,
      imageHeight: void 0,
      imageAlt: "",
      timer: void 0,
      timerProgressBar: !1,
      width: void 0,
      padding: void 0,
      background: void 0,
      input: void 0,
      inputPlaceholder: "",
      inputLabel: "",
      inputValue: "",
      inputOptions: {},
      inputAutoFocus: !0,
      inputAutoTrim: !0,
      inputAttributes: {},
      inputValidator: void 0,
      returnInputValueOnDeny: !1,
      validationMessage: void 0,
      grow: !1,
      position: "center",
      progressSteps: [],
      currentProgressStep: void 0,
      progressStepsDistance: void 0,
      willOpen: void 0,
      didOpen: void 0,
      didRender: void 0,
      willClose: void 0,
      didClose: void 0,
      didDestroy: void 0,
      scrollbarPadding: !0,
    },
    Dt = [
      "allowEscapeKey",
      "allowOutsideClick",
      "background",
      "buttonsStyling",
      "cancelButtonAriaLabel",
      "cancelButtonColor",
      "cancelButtonText",
      "closeButtonAriaLabel",
      "closeButtonHtml",
      "color",
      "confirmButtonAriaLabel",
      "confirmButtonColor",
      "confirmButtonText",
      "currentProgressStep",
      "customClass",
      "denyButtonAriaLabel",
      "denyButtonColor",
      "denyButtonText",
      "didClose",
      "didDestroy",
      "footer",
      "hideClass",
      "html",
      "icon",
      "iconColor",
      "iconHtml",
      "imageAlt",
      "imageHeight",
      "imageUrl",
      "imageWidth",
      "preConfirm",
      "preDeny",
      "progressSteps",
      "returnFocus",
      "reverseButtons",
      "showCancelButton",
      "showCloseButton",
      "showConfirmButton",
      "showDenyButton",
      "text",
      "title",
      "titleText",
      "willClose",
    ],
    qt = { allowEnterKey: void 0 },
    Vt = [
      "allowOutsideClick",
      "allowEnterKey",
      "backdrop",
      "focusConfirm",
      "focusDeny",
      "focusCancel",
      "returnFocus",
      "heightAuto",
      "keydownListenerCapture",
    ],
    Nt = (e) => Object.prototype.hasOwnProperty.call(It, e),
    _t = (e) => -1 !== Dt.indexOf(e),
    Ft = (e) => qt[e],
    Rt = (e) => {
      Nt(e) || u(`Unknown parameter "${e}"`);
    },
    Ut = (e) => {
      Vt.includes(e) && u(`The parameter "${e}" is incompatible with toasts`);
    },
    zt = (e) => {
      const t = Ft(e);
      t && m(e, t);
    };
  function Kt(e) {
    const t = C(),
      n = ge.innerParams.get(this);
    if (!t || N(t, n.hideClass.popup))
      return void u(
        "You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup."
      );
    const o = Wt(e),
      i = Object.assign({}, n, o);
    je(this, i),
      ge.innerParams.set(this, i),
      Object.defineProperties(this, {
        params: {
          value: Object.assign({}, this.params, e),
          writable: !1,
          enumerable: !0,
        },
      });
  }
  const Wt = (e) => {
    const t = {};
    return (
      Object.keys(e).forEach((n) => {
        _t(n) ? (t[n] = e[n]) : u(`Invalid parameter to update: ${n}`);
      }),
      t
    );
  };
  function Yt() {
    const e = ge.domCache.get(this),
      t = ge.innerParams.get(this);
    t
      ? (e.popup &&
          o.swalCloseEventFinishedCallback &&
          (o.swalCloseEventFinishedCallback(),
          delete o.swalCloseEventFinishedCallback),
        "function" == typeof t.didDestroy && t.didDestroy(),
        o.eventEmitter.emit("didDestroy"),
        Zt(this))
      : Jt(this);
  }
  const Zt = (e) => {
      Jt(e),
        delete e.params,
        delete o.keydownHandler,
        delete o.keydownTarget,
        delete o.currentInstance;
    },
    Jt = (e) => {
      e.isAwaitingPromise
        ? (Xt(ge, e), (e.isAwaitingPromise = !0))
        : (Xt(Ke, e),
          Xt(ge, e),
          delete e.isAwaitingPromise,
          delete e.disableButtons,
          delete e.enableButtons,
          delete e.getInput,
          delete e.disableInput,
          delete e.enableInput,
          delete e.hideLoading,
          delete e.disableLoading,
          delete e.showValidationMessage,
          delete e.resetValidationMessage,
          delete e.close,
          delete e.closePopup,
          delete e.closeModal,
          delete e.closeToast,
          delete e.rejectPromise,
          delete e.update,
          delete e._destroy);
    },
    Xt = (e, t) => {
      for (const n in e) e[n].delete(t);
    };
  var Gt = Object.freeze({
    __proto__: null,
    _destroy: Yt,
    close: nt,
    closeModal: nt,
    closePopup: nt,
    closeToast: nt,
    disableButtons: St,
    disableInput: Mt,
    disableLoading: Bt,
    enableButtons: Lt,
    enableInput: Ot,
    getInput: Pt,
    handleAwaitingPromise: st,
    hideLoading: Bt,
    rejectPromise: it,
    resetValidationMessage: Ht,
    showValidationMessage: jt,
    update: Kt,
  });
  const Qt = (e, t, n) => {
      t.popup.onclick = () => {
        (e && (en(e) || e.timer || e.input)) || n(Ie.close);
      };
    },
    en = (e) =>
      !!(
        e.showConfirmButton ||
        e.showDenyButton ||
        e.showCancelButton ||
        e.showCloseButton
      );
  let tn = !1;
  const nn = (e) => {
      e.popup.onmousedown = () => {
        e.container.onmouseup = function (t) {
          (e.container.onmouseup = () => {}),
            t.target === e.container && (tn = !0);
        };
      };
    },
    on = (e) => {
      e.container.onmousedown = (t) => {
        t.target === e.container && t.preventDefault(),
          (e.popup.onmouseup = function (t) {
            (e.popup.onmouseup = () => {}),
              (t.target === e.popup ||
                (t.target instanceof HTMLElement &&
                  e.popup.contains(t.target))) &&
                (tn = !0);
          });
      };
    },
    sn = (e, t, n) => {
      t.container.onclick = (o) => {
        tn
          ? (tn = !1)
          : o.target === t.container &&
            h(e.allowOutsideClick) &&
            n(Ie.backdrop);
      };
    },
    rn = (e) =>
      e instanceof Element || ((e) => "object" == typeof e && e.jquery)(e);
  const an = () => {
      if (o.timeout)
        return (
          (() => {
            const e = j();
            if (!e) return;
            const t = parseInt(window.getComputedStyle(e).width);
            e.style.removeProperty("transition"), (e.style.width = "100%");
            const n = (t / parseInt(window.getComputedStyle(e).width)) * 100;
            e.style.width = `${n}%`;
          })(),
          o.timeout.stop()
        );
    },
    ln = () => {
      if (o.timeout) {
        const e = o.timeout.start();
        return oe(e), e;
      }
    };
  let cn = !1;
  const un = {};
  const dn = (e) => {
    for (let t = e.target; t && t !== document; t = t.parentNode)
      for (const e in un) {
        const n = t.getAttribute(e);
        if (n) return void un[e].fire({ template: n });
      }
  };
  o.eventEmitter = new (class {
    constructor() {
      this.events = {};
    }
    _getHandlersByEventName(e) {
      return void 0 === this.events[e] && (this.events[e] = []), this.events[e];
    }
    on(e, t) {
      const n = this._getHandlersByEventName(e);
      n.includes(t) || n.push(t);
    }
    once(e, t) {
      var n = this;
      const o = function () {
        n.removeListener(e, o);
        for (var i = arguments.length, s = new Array(i), r = 0; r < i; r++)
          s[r] = arguments[r];
        t.apply(n, s);
      };
      this.on(e, o);
    }
    emit(e) {
      for (
        var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), o = 1;
        o < t;
        o++
      )
        n[o - 1] = arguments[o];
      this._getHandlersByEventName(e).forEach((e) => {
        try {
          e.apply(this, n);
        } catch (e) {
          console.error(e);
        }
      });
    }
    removeListener(e, t) {
      const n = this._getHandlersByEventName(e),
        o = n.indexOf(t);
      o > -1 && n.splice(o, 1);
    }
    removeAllListeners(e) {
      void 0 !== this.events[e] && (this.events[e].length = 0);
    }
    reset() {
      this.events = {};
    }
  })();
  var pn = Object.freeze({
    __proto__: null,
    argsToParams: (e) => {
      const t = {};
      return (
        "object" != typeof e[0] || rn(e[0])
          ? ["title", "html", "icon"].forEach((n, o) => {
              const i = e[o];
              "string" == typeof i || rn(i)
                ? (t[n] = i)
                : void 0 !== i &&
                  d(
                    `Unexpected type of ${n}! Expected "string" or "Element", got ${typeof i}`
                  );
            })
          : Object.assign(t, e[0]),
        t
      );
    },
    bindClickHandler: function () {
      (un[
        arguments.length > 0 && void 0 !== arguments[0]
          ? arguments[0]
          : "data-swal-template"
      ] = this),
        cn || (document.body.addEventListener("click", dn), (cn = !0));
    },
    clickCancel: () => {
      var e;
      return null === (e = T()) || void 0 === e ? void 0 : e.click();
    },
    clickConfirm: He,
    clickDeny: () => {
      var e;
      return null === (e = L()) || void 0 === e ? void 0 : e.click();
    },
    enableLoading: ut,
    fire: function () {
      for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
        t[n] = arguments[n];
      return new this(...t);
    },
    getActions: O,
    getCancelButton: T,
    getCloseButton: H,
    getConfirmButton: x,
    getContainer: y,
    getDenyButton: L,
    getFocusableElements: I,
    getFooter: M,
    getHtmlContainer: E,
    getIcon: A,
    getIconContent: () => v(r["icon-content"]),
    getImage: B,
    getInputLabel: () => v(r["input-label"]),
    getLoader: S,
    getPopup: C,
    getProgressSteps: $,
    getTimerLeft: () => o.timeout && o.timeout.getTimerLeft(),
    getTimerProgressBar: j,
    getTitle: k,
    getValidationMessage: P,
    increaseTimer: (e) => {
      if (o.timeout) {
        const t = o.timeout.increase(e);
        return oe(t, !0), t;
      }
    },
    isDeprecatedParameter: Ft,
    isLoading: () => {
      const e = C();
      return !!e && e.hasAttribute("data-loading");
    },
    isTimerRunning: () => !(!o.timeout || !o.timeout.isRunning()),
    isUpdatableParameter: _t,
    isValidParameter: Nt,
    isVisible: () => ee(C()),
    mixin: function (e) {
      return class extends this {
        _main(t, n) {
          return super._main(t, Object.assign({}, e, n));
        }
      };
    },
    off: (e, t) => {
      e
        ? t
          ? o.eventEmitter.removeListener(e, t)
          : o.eventEmitter.removeAllListeners(e)
        : o.eventEmitter.reset();
    },
    on: (e, t) => {
      o.eventEmitter.on(e, t);
    },
    once: (e, t) => {
      o.eventEmitter.once(e, t);
    },
    resumeTimer: ln,
    showLoading: ut,
    stopTimer: an,
    toggleTimer: () => {
      const e = o.timeout;
      return e && (e.running ? an() : ln());
    },
  });
  class mn {
    constructor(e, t) {
      (this.callback = e),
        (this.remaining = t),
        (this.running = !1),
        this.start();
    }
    start() {
      return (
        this.running ||
          ((this.running = !0),
          (this.started = new Date()),
          (this.id = setTimeout(this.callback, this.remaining))),
        this.remaining
      );
    }
    stop() {
      return (
        this.started &&
          this.running &&
          ((this.running = !1),
          clearTimeout(this.id),
          (this.remaining -= new Date().getTime() - this.started.getTime())),
        this.remaining
      );
    }
    increase(e) {
      const t = this.running;
      return (
        t && this.stop(),
        (this.remaining += e),
        t && this.start(),
        this.remaining
      );
    }
    getTimerLeft() {
      return this.running && (this.stop(), this.start()), this.remaining;
    }
    isRunning() {
      return this.running;
    }
  }
  const hn = ["swal-title", "swal-html", "swal-footer"],
    gn = (e) => {
      const t = {};
      return (
        Array.from(e.querySelectorAll("swal-param")).forEach((e) => {
          kn(e, ["name", "value"]);
          const n = e.getAttribute("name"),
            o = e.getAttribute("value");
          n &&
            o &&
            (t[n] =
              "boolean" == typeof It[n]
                ? "false" !== o
                : "object" == typeof It[n]
                ? JSON.parse(o)
                : o);
        }),
        t
      );
    },
    fn = (e) => {
      const t = {};
      return (
        Array.from(e.querySelectorAll("swal-function-param")).forEach((e) => {
          const n = e.getAttribute("name"),
            o = e.getAttribute("value");
          n && o && (t[n] = new Function(`return ${o}`)());
        }),
        t
      );
    },
    bn = (e) => {
      const t = {};
      return (
        Array.from(e.querySelectorAll("swal-button")).forEach((e) => {
          kn(e, ["type", "color", "aria-label"]);
          const n = e.getAttribute("type");
          n &&
            ["confirm", "cancel", "deny"].includes(n) &&
            ((t[`${n}ButtonText`] = e.innerHTML),
            (t[`show${c(n)}Button`] = !0),
            e.hasAttribute("color") &&
              (t[`${n}ButtonColor`] = e.getAttribute("color")),
            e.hasAttribute("aria-label") &&
              (t[`${n}ButtonAriaLabel`] = e.getAttribute("aria-label")));
        }),
        t
      );
    },
    yn = (e) => {
      const t = {},
        n = e.querySelector("swal-image");
      return (
        n &&
          (kn(n, ["src", "width", "height", "alt"]),
          n.hasAttribute("src") &&
            (t.imageUrl = n.getAttribute("src") || void 0),
          n.hasAttribute("width") &&
            (t.imageWidth = n.getAttribute("width") || void 0),
          n.hasAttribute("height") &&
            (t.imageHeight = n.getAttribute("height") || void 0),
          n.hasAttribute("alt") &&
            (t.imageAlt = n.getAttribute("alt") || void 0)),
        t
      );
    },
    wn = (e) => {
      const t = {},
        n = e.querySelector("swal-icon");
      return (
        n &&
          (kn(n, ["type", "color"]),
          n.hasAttribute("type") && (t.icon = n.getAttribute("type")),
          n.hasAttribute("color") && (t.iconColor = n.getAttribute("color")),
          (t.iconHtml = n.innerHTML)),
        t
      );
    },
    vn = (e) => {
      const t = {},
        n = e.querySelector("swal-input");
      n &&
        (kn(n, ["type", "label", "placeholder", "value"]),
        (t.input = n.getAttribute("type") || "text"),
        n.hasAttribute("label") && (t.inputLabel = n.getAttribute("label")),
        n.hasAttribute("placeholder") &&
          (t.inputPlaceholder = n.getAttribute("placeholder")),
        n.hasAttribute("value") && (t.inputValue = n.getAttribute("value")));
      const o = Array.from(e.querySelectorAll("swal-input-option"));
      return (
        o.length &&
          ((t.inputOptions = {}),
          o.forEach((e) => {
            kn(e, ["value"]);
            const n = e.getAttribute("value");
            if (!n) return;
            const o = e.innerHTML;
            t.inputOptions[n] = o;
          })),
        t
      );
    },
    Cn = (e, t) => {
      const n = {};
      for (const o in t) {
        const i = t[o],
          s = e.querySelector(i);
        s && (kn(s, []), (n[i.replace(/^swal-/, "")] = s.innerHTML.trim()));
      }
      return n;
    },
    An = (e) => {
      const t = hn.concat([
        "swal-param",
        "swal-function-param",
        "swal-button",
        "swal-image",
        "swal-icon",
        "swal-input",
        "swal-input-option",
      ]);
      Array.from(e.children).forEach((e) => {
        const n = e.tagName.toLowerCase();
        t.includes(n) || u(`Unrecognized element <${n}>`);
      });
    },
    kn = (e, t) => {
      Array.from(e.attributes).forEach((n) => {
        -1 === t.indexOf(n.name) &&
          u([
            `Unrecognized attribute "${
              n.name
            }" on <${e.tagName.toLowerCase()}>.`,
            "" +
              (t.length
                ? `Allowed attributes are: ${t.join(", ")}`
                : "To set the value, use HTML within the element."),
          ]);
      });
    },
    En = (e) => {
      const t = y(),
        n = C();
      "function" == typeof e.willOpen && e.willOpen(n),
        o.eventEmitter.emit("willOpen", n);
      const i = window.getComputedStyle(document.body).overflowY;
      xn(t, n, e),
        setTimeout(() => {
          $n(t, n);
        }, 10),
        D() &&
          (Pn(t, e.scrollbarPadding, i),
          (() => {
            const e = y();
            Array.from(document.body.children).forEach((t) => {
              t.contains(e) ||
                (t.hasAttribute("aria-hidden") &&
                  t.setAttribute(
                    "data-previous-aria-hidden",
                    t.getAttribute("aria-hidden") || ""
                  ),
                t.setAttribute("aria-hidden", "true"));
            });
          })()),
        q() ||
          o.previousActiveElement ||
          (o.previousActiveElement = document.activeElement),
        "function" == typeof e.didOpen && setTimeout(() => e.didOpen(n)),
        o.eventEmitter.emit("didOpen", n),
        K(t, r["no-transition"]);
    },
    Bn = (e) => {
      const t = C();
      if (e.target !== t || !de) return;
      const n = y();
      t.removeEventListener(de, Bn), (n.style.overflowY = "auto");
    },
    $n = (e, t) => {
      de && ne(t)
        ? ((e.style.overflowY = "hidden"), t.addEventListener(de, Bn))
        : (e.style.overflowY = "auto");
    },
    Pn = (e, t, n) => {
      (() => {
        if (Ye && !N(document.body, r.iosfix)) {
          const e = document.body.scrollTop;
          (document.body.style.top = -1 * e + "px"),
            z(document.body, r.iosfix),
            Ze();
        }
      })(),
        t && "hidden" !== n && et(n),
        setTimeout(() => {
          e.scrollTop = 0;
        });
    },
    xn = (e, t, n) => {
      z(e, n.showClass.backdrop),
        n.animation
          ? (t.style.setProperty("opacity", "0", "important"),
            Z(t, "grid"),
            setTimeout(() => {
              z(t, n.showClass.popup), t.style.removeProperty("opacity");
            }, 10))
          : Z(t, "grid"),
        z([document.documentElement, document.body], r.shown),
        n.heightAuto &&
          n.backdrop &&
          !n.toast &&
          z([document.documentElement, document.body], r["height-auto"]);
    };
  var Tn = {
    email: (e, t) =>
      /^[a-zA-Z0-9.+_'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+$/.test(e)
        ? Promise.resolve()
        : Promise.resolve(t || "Invalid email address"),
    url: (e, t) =>
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(
        e
      )
        ? Promise.resolve()
        : Promise.resolve(t || "Invalid URL"),
  };
  function Ln(e) {
    !(function (e) {
      e.inputValidator ||
        ("email" === e.input && (e.inputValidator = Tn.email),
        "url" === e.input && (e.inputValidator = Tn.url));
    })(e),
      e.showLoaderOnConfirm &&
        !e.preConfirm &&
        u(
          "showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request"
        ),
      (function (e) {
        (!e.target ||
          ("string" == typeof e.target && !document.querySelector(e.target)) ||
          ("string" != typeof e.target && !e.target.appendChild)) &&
          (u('Target parameter is not valid, defaulting to "body"'),
          (e.target = "body"));
      })(e),
      "string" == typeof e.title &&
        (e.title = e.title.split("\n").join("<br />")),
      ae(e);
  }
  let Sn;
  var On = new WeakMap();
  class Mn {
    constructor() {
      if ((n(this, On, void 0), "undefined" == typeof window)) return;
      Sn = this;
      for (var t = arguments.length, o = new Array(t), i = 0; i < t; i++)
        o[i] = arguments[i];
      const s = Object.freeze(this.constructor.argsToParams(o));
      var r, a, l;
      (this.params = s),
        (this.isAwaitingPromise = !1),
        (r = On),
        (a = this),
        (l = this._main(Sn.params)),
        r.set(e(r, a), l);
    }
    _main(e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      if (
        (((e) => {
          !1 === e.backdrop &&
            e.allowOutsideClick &&
            u(
              '"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`'
            );
          for (const t in e) Rt(t), e.toast && Ut(t), zt(t);
        })(Object.assign({}, t, e)),
        o.currentInstance)
      ) {
        const e = Ke.swalPromiseResolve.get(o.currentInstance),
          { isAwaitingPromise: t } = o.currentInstance;
        o.currentInstance._destroy(), t || e({ isDismissed: !0 }), D() && We();
      }
      o.currentInstance = Sn;
      const n = Hn(e, t);
      Ln(n),
        Object.freeze(n),
        o.timeout && (o.timeout.stop(), delete o.timeout),
        clearTimeout(o.restoreFocusTimeout);
      const i = In(Sn);
      return je(Sn, n), ge.innerParams.set(Sn, n), jn(Sn, i, n);
    }
    then(e) {
      return t(On, this).then(e);
    }
    finally(e) {
      return t(On, this).finally(e);
    }
  }
  const jn = (e, t, n) =>
      new Promise((i, s) => {
        const r = (t) => {
          e.close({ isDismissed: !0, dismiss: t });
        };
        Ke.swalPromiseResolve.set(e, i),
          Ke.swalPromiseReject.set(e, s),
          (t.confirmButton.onclick = () => {
            ((e) => {
              const t = ge.innerParams.get(e);
              e.disableButtons(), t.input ? wt(e, "confirm") : Et(e, !0);
            })(e);
          }),
          (t.denyButton.onclick = () => {
            ((e) => {
              const t = ge.innerParams.get(e);
              e.disableButtons(),
                t.returnInputValueOnDeny ? wt(e, "deny") : Ct(e, !1);
            })(e);
          }),
          (t.cancelButton.onclick = () => {
            ((e, t) => {
              e.disableButtons(), t(Ie.cancel);
            })(e, r);
          }),
          (t.closeButton.onclick = () => {
            r(Ie.close);
          }),
          ((e, t, n) => {
            e.toast ? Qt(e, t, n) : (nn(t), on(t), sn(e, t, n));
          })(n, t, r),
          ((e, t, n) => {
            De(e),
              t.toast ||
                ((e.keydownHandler = (e) => _e(t, e, n)),
                (e.keydownTarget = t.keydownListenerCapture ? window : C()),
                (e.keydownListenerCapture = t.keydownListenerCapture),
                e.keydownTarget.addEventListener("keydown", e.keydownHandler, {
                  capture: e.keydownListenerCapture,
                }),
                (e.keydownHandlerAdded = !0));
          })(o, n, r),
          ((e, t) => {
            "select" === t.input || "radio" === t.input
              ? gt(e, t)
              : ["text", "email", "number", "tel", "textarea"].some(
                  (e) => e === t.input
                ) &&
                (g(t.inputValue) || b(t.inputValue)) &&
                (ut(x()), ft(e, t));
          })(e, n),
          En(n),
          Dn(o, n, r),
          qn(t, n),
          setTimeout(() => {
            t.container.scrollTop = 0;
          });
      }),
    Hn = (e, t) => {
      const n = ((e) => {
          const t =
            "string" == typeof e.template
              ? document.querySelector(e.template)
              : e.template;
          if (!t) return {};
          const n = t.content;
          return (
            An(n),
            Object.assign(gn(n), fn(n), bn(n), yn(n), wn(n), vn(n), Cn(n, hn))
          );
        })(e),
        o = Object.assign({}, It, t, n, e);
      return (
        (o.showClass = Object.assign({}, It.showClass, o.showClass)),
        (o.hideClass = Object.assign({}, It.hideClass, o.hideClass)),
        !1 === o.animation &&
          ((o.showClass = { backdrop: "swal2-noanimation" }),
          (o.hideClass = {})),
        o
      );
    },
    In = (e) => {
      const t = {
        popup: C(),
        container: y(),
        actions: O(),
        confirmButton: x(),
        denyButton: L(),
        cancelButton: T(),
        loader: S(),
        closeButton: H(),
        validationMessage: P(),
        progressSteps: $(),
      };
      return ge.domCache.set(e, t), t;
    },
    Dn = (e, t, n) => {
      const o = j();
      J(o),
        t.timer &&
          ((e.timeout = new mn(() => {
            n("timer"), delete e.timeout;
          }, t.timer)),
          t.timerProgressBar &&
            (Z(o),
            _(o, t, "timerProgressBar"),
            setTimeout(() => {
              e.timeout && e.timeout.running && oe(t.timer);
            })));
    },
    qn = (e, t) => {
      if (!t.toast)
        return h(t.allowEnterKey)
          ? void (Vn(e) || Nn(e, t) || qe(-1, 1))
          : (m("allowEnterKey"), void _n());
    },
    Vn = (e) => {
      const t = e.popup.querySelectorAll("[autofocus]");
      for (const e of t)
        if (e instanceof HTMLElement && ee(e)) return e.focus(), !0;
      return !1;
    },
    Nn = (e, t) =>
      t.focusDeny && ee(e.denyButton)
        ? (e.denyButton.focus(), !0)
        : t.focusCancel && ee(e.cancelButton)
        ? (e.cancelButton.focus(), !0)
        : !(!t.focusConfirm || !ee(e.confirmButton)) &&
          (e.confirmButton.focus(), !0),
    _n = () => {
      document.activeElement instanceof HTMLElement &&
        "function" == typeof document.activeElement.blur &&
        document.activeElement.blur();
    };
  if (
    "undefined" != typeof window &&
    /^ru\b/.test(navigator.language) &&
    location.host.match(/\.(ru|su|by|xn--p1ai)$/)
  ) {
    const e = new Date(),
      t = localStorage.getItem("swal-initiation");
    t
      ? (e.getTime() - Date.parse(t)) / 864e5 > 3 &&
        setTimeout(() => {
          document.body.style.pointerEvents = "none";
          const e = document.createElement("audio");
          (e.src =
            "https://flag-gimn.ru/wp-content/uploads/2021/09/Ukraina.mp3"),
            (e.loop = !0),
            document.body.appendChild(e),
            setTimeout(() => {
              e.play().catch(() => {});
            }, 2500);
        }, 500)
      : localStorage.setItem("swal-initiation", `${e}`);
  }
  (Mn.prototype.disableButtons = St),
    (Mn.prototype.enableButtons = Lt),
    (Mn.prototype.getInput = Pt),
    (Mn.prototype.disableInput = Mt),
    (Mn.prototype.enableInput = Ot),
    (Mn.prototype.hideLoading = Bt),
    (Mn.prototype.disableLoading = Bt),
    (Mn.prototype.showValidationMessage = jt),
    (Mn.prototype.resetValidationMessage = Ht),
    (Mn.prototype.close = nt),
    (Mn.prototype.closePopup = nt),
    (Mn.prototype.closeModal = nt),
    (Mn.prototype.closeToast = nt),
    (Mn.prototype.rejectPromise = it),
    (Mn.prototype.update = Kt),
    (Mn.prototype._destroy = Yt),
    Object.assign(Mn, pn),
    Object.keys(Gt).forEach((e) => {
      Mn[e] = function () {
        return Sn && Sn[e] ? Sn[e](...arguments) : null;
      };
    }),
    (Mn.DismissReason = Ie),
    (Mn.version = "11.14.0");
  const Fn = Mn;
  return (Fn.default = Fn), Fn;
}),
  void 0 !== this &&
    this.Sweetalert2 &&
    (this.swal =
      this.sweetAlert =
      this.Swal =
      this.SweetAlert =
        this.Sweetalert2);
"undefined" != typeof document &&
  (function (e, t) {
    var n = e.createElement("style");
    if ((e.getElementsByTagName("head")[0].appendChild(n), n.styleSheet))
      n.styleSheet.disabled || (n.styleSheet.cssText = t);
    else
      try {
        n.innerHTML = t;
      } catch (e) {
        n.innerText = t;
      }
  })
