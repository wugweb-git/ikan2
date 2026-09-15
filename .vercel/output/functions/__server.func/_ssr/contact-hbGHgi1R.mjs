import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as Illustration } from "./art-CKGIg2zx.mjs";
import { r as contactPage } from "./content-pwglTkg-.mjs";
import { S as useAuth, l as displayName, n as LEGACY_ANON_KEY, r as LEGACY_API } from "./auth-xMCnsA0H.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Phone, Ft as Check, W as Mail, w as ShieldAlert } from "../_libs/lucide-react.mjs";
import { t as InfoShell } from "./info-shell-_j2_-UyW.mjs";
import { a as PrimaryButton, i as FormError, r as Field } from "./auth-ui-DXj6R5BN.mjs";
import { _ as validate, c as minLength, f as personName, i as email, s as maxLength, t as all } from "./validate-DQrl-c4D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-hbGHgi1R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContactPage() {
	const { user } = useAuth();
	const [name, setName] = (0, import_react.useState)(displayName(user));
	const [email$1, setEmail] = (0, import_react.useState)(user?.email ?? "");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [sent, setSent] = (0, import_react.useState)(false);
	const [touched, setTouched] = (0, import_react.useState)(false);
	const { errors, ok } = validate({
		name,
		email: email$1,
		subject,
		message
	}, {
		name: personName,
		email,
		subject: maxLength(120, "the subject"),
		message: all(minLength(10, "Write a little more so we can help (10 characters or more)."), maxLength(2e3, "your message"))
	});
	const show = (k) => touched ? errors[k] : void 0;
	const submit = async (e) => {
		e.preventDefault();
		setTouched(true);
		if (!ok) {
			setError(null);
			return;
		}
		setBusy(true);
		setError(null);
		try {
			const res = await fetch(`${LEGACY_API}/contact/submit`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${LEGACY_ANON_KEY}`
				},
				body: JSON.stringify({
					name: name.trim(),
					email: email$1.trim(),
					subject: subject.trim() || "General enquiry",
					message: message.trim()
				})
			});
			if (!res.ok) throw new Error(await res.text() || "Your message didn’t send.");
			setSent(true);
		} catch {
			setError("Your message didn’t send. Check your connection and try again, or email us directly.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(InfoShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-[32px] font-semibold leading-10",
				children: contactPage.heroTitle
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[16px] leading-6 text-muted-foreground",
				children: contactPage.heroSubtitle
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-5 mt-6 overflow-hidden rounded-[24px] bg-[#F9DEDC] text-[#5A1410]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "mt-0.5 h-6 w-6 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-[18px] font-semibold",
						children: contactPage.crisisCard.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[14px] leading-5",
						children: contactPage.crisisCard.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [contactPage.crisisCard.buttons.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: b.action,
							className: "inline-flex h-10 items-center gap-2 rounded-full bg-[#5A1410] px-4 text-[14px] font-semibold text-white",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" }),
								" ",
								b.label
							]
						}, b.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/support",
							className: "inline-flex h-10 items-center rounded-full border border-[#5A1410]/30 px-4 text-[14px] font-semibold",
							children: "More helplines"
						})]
					})
				] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mx-5 mt-3 grid grid-cols-2 gap-3",
			children: contactPage.contactMethods.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: m.action,
				className: "block h-full rounded-[20px] bg-secondary p-4",
				children: [
					m.icon === "phone" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-5 w-5" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[15px] font-semibold",
						children: m.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-[12px] leading-4 text-muted-foreground",
						children: m.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 break-all text-[13px] font-semibold",
						children: m.value
					})
				]
			}) }, m.title))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-5 mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[20px] font-semibold",
					children: contactPage.formTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[14px] text-muted-foreground",
					children: contactPage.formSubtitle
				}),
				sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 overflow-hidden rounded-[24px] bg-[#DFF0E8] text-[#173D2F]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, { art: "checkup" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 h-5 w-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[15px] leading-6",
							children: [
								"Message sent. We’ll reply to ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: email$1
								}),
								"."
							]
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					noValidate: true,
					className: "mt-4 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormError, { message: error }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Name",
							autoComplete: "name",
							value: name,
							onChange: setName,
							maxLength: 60,
							error: show("name")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							type: "email",
							autoComplete: "email",
							value: email$1,
							onChange: setEmail,
							maxLength: 254,
							error: show("email")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Subject (optional)",
							value: subject,
							onChange: setSubject,
							maxLength: 120,
							error: show("subject")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mb-1.5 flex justify-between text-[13px] font-medium text-muted-foreground",
									children: ["Message", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular-nums",
										children: [message.length, "/2000"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: message,
									onChange: (e) => setMessage(e.target.value),
									rows: 5,
									maxLength: 2e3,
									"aria-invalid": Boolean(show("message")),
									className: `w-full resize-none rounded-[16px] border bg-secondary px-4 py-3 text-[16px] outline-none focus:border-foreground/60 focus:bg-background ${show("message") ? "border-[#B3261E]" : "border-transparent"}`
								}),
								show("message") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									role: "alert",
									className: "mt-1.5 block text-[13px] text-[#B3261E]",
									children: show("message")
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
							busy,
							children: "Send message"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/faq",
			className: "mx-5 mt-8 block rounded-[24px] border border-foreground/10 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-[17px] font-semibold",
					children: contactPage.faqCard.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[14px] leading-5 text-muted-foreground",
					children: contactPage.faqCard.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-3 inline-block text-[14px] font-semibold underline underline-offset-4",
					children: contactPage.faqCard.buttonText
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6" })
	] });
}
//#endregion
export { ContactPage as component };
