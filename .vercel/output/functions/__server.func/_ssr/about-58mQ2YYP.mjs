import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as Illustration, t as Avatar } from "./art-CKGIg2zx.mjs";
import { s as unmark, t as aboutPage } from "./content-pwglTkg-.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ot as ClipboardList, _ as Sparkles, c as UserRoundSearch, lt as Handshake, ot as Heart, pt as FlaskConical, x as Shield } from "../_libs/lucide-react.mjs";
import { t as InfoShell } from "./info-shell-_j2_-UyW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-58mQ2YYP.js
var import_jsx_runtime = require_jsx_runtime();
var valueIcon = {
	heart: Heart,
	shield: Shield,
	"flask-conical": FlaskConical,
	handshake: Handshake
};
var stepIcon = [
	ClipboardList,
	UserRoundSearch,
	Sparkles
];
/** Team photos copied from the old iKan repo (public/team), named by first name. */
var photoOf = (name) => `/team/${name.split(" ")[0].toLowerCase()}.jpg`;
var hue = (name) => [...name].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 360, 7);
var initialsOf = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2);
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(InfoShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-[34px] font-semibold leading-[1.15] tracking-[-0.01em]",
				children: aboutPage.hero.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[17px] leading-7 text-muted-foreground",
				children: aboutPage.hero.subtitle
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-5 mt-6 h-44 overflow-hidden rounded-[28px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, { art: "mood" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8 px-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] font-semibold text-[#2B634D]",
					children: aboutPage.story.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-[24px] font-semibold leading-8",
					children: unmark(aboutPage.story.heading)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 space-y-4 text-[16px] leading-7 text-foreground/85",
					children: aboutPage.story.paragraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: unmark(p) }, p.slice(0, 20)))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mt-8 space-y-3 px-5",
			children: [aboutPage.mission, aboutPage.vision].map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: i === 0 ? "rounded-[24px] bg-foreground p-5 text-background" : "rounded-[24px] bg-[#DFF0E8] p-5 text-[#173D2F]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] font-semibold opacity-75",
						children: m.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-[20px] font-semibold leading-7",
						children: m.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[15px] leading-6 opacity-85",
						children: m.description
					})
				]
			}, m.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10 px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-[22px] font-semibold",
				children: aboutPage.valuesHeading
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-2 gap-3",
				children: aboutPage.values.map((v) => {
					const Icon = valueIcon[v.iconName] ?? Heart;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[20px] bg-secondary p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-[16px] font-semibold",
								children: v.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[13px] leading-5 text-muted-foreground",
								children: v.description
							})
						]
					}, v.title);
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10 px-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[22px] font-semibold",
					children: aboutPage.howItWorks.heading
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-4 space-y-4",
					children: aboutPage.howItWorks.steps.map((s, i) => {
						const Icon = stepIcon[i] ?? Sparkles;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative flex flex-col items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-11 w-11 place-items-center rounded-full bg-foreground text-background",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
								}), i < aboutPage.howItWorks.steps.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 w-px flex-1 bg-foreground/15" }) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "pb-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-display text-[17px] font-semibold",
										children: s.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[14px] font-medium text-[#2B634D]",
										children: s.tagline
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-[15px] leading-6 text-muted-foreground",
										children: s.description
									})
								]
							})]
						}, s.title);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/assessments",
					className: "mt-4 flex h-12 items-center justify-center rounded-full bg-foreground text-[15px] font-semibold text-background",
					children: "Get started"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "px-5 font-display text-[22px] font-semibold",
				children: aboutPage.whoFor.heading
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-scrollbar mt-4 flex snap-x gap-3 overflow-x-auto px-5 pb-1",
				children: aboutPage.whoFor.groups.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-[260px] shrink-0 snap-start overflow-hidden rounded-[24px] border border-foreground/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, { art: [
							"checkup",
							"work",
							"measure"
						][i] ?? "checkup" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-[17px] font-semibold",
								children: g.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[14px] font-medium text-[#2B634D]",
								children: g.tagline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-[14px] leading-6 text-muted-foreground",
								children: g.description
							})
						]
					})]
				}, g.title))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10 px-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[22px] font-semibold",
					children: aboutPage.teamHeading
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[15px] leading-6 text-muted-foreground",
					children: aboutPage.teamDescription
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3",
					children: aboutPage.founders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-[24px] bg-secondary p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								text: initialsOf(f.name),
								hue: hue(f.name),
								size: 64,
								photo: photoOf(f.name)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-[17px] font-semibold",
								children: f.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] text-muted-foreground",
								children: f.role
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-[14px] leading-6 text-foreground/85",
							children: f.bio
						})]
					}, f.name))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 grid grid-cols-3 gap-2",
					children: aboutPage.team.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-col items-center rounded-[20px] border border-foreground/10 p-3 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								text: initialsOf(t.name),
								hue: hue(t.name),
								size: 56,
								photo: photoOf(t.name)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-[13px] font-semibold leading-4",
								children: t.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-[11px] leading-4 text-muted-foreground",
								children: t.role
							})
						]
					}, t.name))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6" })
	] });
}
//#endregion
export { AboutPage as component };
