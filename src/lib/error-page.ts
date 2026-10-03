/* The last page the server can serve: SSR itself failed, so there is no bundle, no React and no
 * app CSS behind this. Everything it needs is inline, and it still has to be the same product as
 * the screen beside it, because someone who lands here may already be having a hard day.
 *
 * It mirrors the in-app state screens exactly: the same mark, the same drawn line, the same pill
 * buttons, the same crisis row. It does the little it can without the app behind it - knows
 * whether the phone is online and says the right thing either way, reloads itself the moment the
 * connection comes back, and shows that a retry is actually running. The Google Fonts link is the
 * one the app uses, with the system stack behind it. */

const MARK =
  "M38.9575 62.428H42.6398V46.0228L54.5382 57.3991L57.0464 54.8939L45.652 43.0072H61.8906C62.576 " +
  "42.4908 62.4807 41.3104 62.41 40.4775C62.3823 40.167 62.4346 39.8473 62.3393 39.543L61.8906 " +
  "38.9866H45.652L57.0464 27.0999L54.5382 24.5947L42.6398 35.9712V19.572H38.9575V30.6226C38.2382 " +
  "30.1615 37.9186 28.9566 37.562 28.1696C36.4463 25.7075 35.4535 23.15 34.5928 20.5895L30.9321 " +
  "22.108L34.937 32.2979L27.0715 24.604C26.6226 25.2987 24.2743 26.7649 24.7078 27.6071L32.2599 " +
  "35.3072L22.0429 30.9884L20.5675 34.4219L30.5847 38.9928H19.5347V43.0103H30.5847L20.5675 " +
  "47.5812L22.0429 51.0147L32.2599 46.6959L24.7078 54.396C24.2713 55.2382 26.6226 56.7044 27.0715 " +
  "57.3991L34.937 49.7052L30.9321 59.8951L34.5928 61.4136C35.4535 58.85 36.4463 56.2956 37.562 " +
  "53.8335C37.9186 53.0465 38.2382 51.8385 38.9575 51.3805V62.431V62.428ZM10 41C10 23.8785 " +
  "23.8809 10 41.0015 10C58.1222 10 72 23.8785 72 41C72 58.1215 58.1222 72 41.0015 72C23.8809 72 " +
  "10.0031 58.1215 10.0031 41H10Z";

/* The same two drawings the in-app screens use, inlined: the line this app draws everywhere
 * else, interrupted; and a signal that stops short. */
const SCENES: Record<string, { ink: string; body: string }> = {
  broken: {
    ink: "#7A5A12",
    body:
      '<path class="draw" d="M24 100 C 62 100, 74 44, 116 44 S 146 88, 150 90" stroke-width="7" />' +
      '<path d="M186 90 C 204 90, 214 40, 252 40 S 288 86, 300 80" stroke-width="7" stroke-opacity="0.38" />',
  },
  offline: {
    ink: "#33415C",
    body:
      '<path class="draw" d="M124 108 A 36 36 0 0 1 196 108" stroke-width="7" />' +
      '<path d="M94 108 A 66 66 0 0 1 226 108" stroke-width="7" stroke-opacity="0.4" stroke-dasharray="3 16" />' +
      '<path d="M64 108 A 96 96 0 0 1 256 108" stroke-width="7" stroke-opacity="0.2" stroke-dasharray="3 16" />' +
      '<circle cx="160" cy="108" r="9" fill="currentColor" stroke="none" />',
  },
};

function scene(name: string, id: string): string {
  const s = SCENES[name]!;
  return (
    `<span class="art" id="${id}" style="color:${s.ink}">` +
    `<svg viewBox="0 0 320 150" aria-hidden="true">` +
    `<g fill="none" stroke="currentColor" stroke-linecap="round">${s.body}</g>` +
    `</svg></span>`
  );
}

export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>That didn't load - iKAN</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="robots" content="noindex" />
    <meta name="theme-color" content="#eef0f4" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@600&display=swap"
    />
    <style>
      :root {
        --canvas: #eef0f4;
        --ink: #15171c;
        --muted: #6a7080;
        --line: rgba(21, 23, 28, 0.15);
        --crisis: #8c1d18;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100dvh;
        display: grid;
        place-items: center;
        padding: 48px calc(24px + env(safe-area-inset-right)) calc(48px + env(safe-area-inset-bottom)) calc(24px + env(safe-area-inset-left));
        background: var(--canvas);
        color: var(--ink);
        font: 400 15px/24px Manrope, ui-sans-serif, system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .card { width: 100%; max-width: 24rem; text-align: center; }
      .brand { display: inline-flex; align-items: center; gap: 6px; color: var(--muted); }
      .brand svg { width: 16px; height: 16px; }
      .brand b { font: 600 13px/1 Sora, ui-sans-serif, system-ui, sans-serif; letter-spacing: 0.08em; }

      .art {
        display: block; width: 100%; margin-top: 40px;
        background: radial-gradient(60% 70% at 50% 58%, color-mix(in oklab, currentColor 14%, transparent), transparent 72%);
      }
      .art svg { display: block; width: 100%; }
      .art.off { display: none; }
      .draw { stroke-dasharray: 420; animation: draw 1.1s cubic-bezier(0.16, 1, 0.3, 1) both; }
      @keyframes draw { from { stroke-dashoffset: 420; } to { stroke-dashoffset: 0; } }

      h1 {
        margin: 32px 0 0;
        font: 600 26px/32px Sora, ui-sans-serif, system-ui, sans-serif;
        letter-spacing: -0.01em;
        text-wrap: balance;
      }
      p { margin: 10px 0 0; color: var(--muted); text-wrap: balance; }

      .actions { margin-top: 32px; display: flex; flex-direction: column; gap: 8px; }
      .btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        height: 48px; padding: 0 24px; border-radius: 999px;
        font: 600 15px/1 Manrope, ui-sans-serif, system-ui, sans-serif;
        text-decoration: none; cursor: pointer; border: 1px solid transparent;
        -webkit-tap-highlight-color: transparent;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .primary { background: var(--ink); color: var(--canvas); }
      .secondary { background: transparent; color: var(--ink); border-color: var(--line); }
      .btn:active { transform: scale(0.98); }

      .crisis {
        margin-top: 32px; display: flex; align-items: center; gap: 12px; width: 100%;
        padding: 12px 16px; border-radius: 20px; text-align: left; text-decoration: none;
        border: 1px solid rgba(140, 29, 24, 0.2); background: rgba(140, 29, 24, 0.04);
        color: var(--crisis);
      }
      .crisis svg { flex: 0 0 auto; }
      .crisis span { flex: 1 1 auto; }
      .crisis b { display: block; font-size: 14px; font-weight: 600; }
      .crisis i { display: block; font: 400 13px/20px Manrope, ui-sans-serif, system-ui, sans-serif; color: var(--muted); }

      .spin { animation: spin 0.9s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
      @media (prefers-reduced-motion: reduce) {
        .draw { animation: none; stroke-dashoffset: 0; }
        .spin { animation: none; }
        .btn { transition: none; }
        .btn:active { transform: none; }
      }
    </style>
  </head>
  <body>
    <main class="card">
      <span class="brand">
        <svg viewBox="10 10 62 62" aria-hidden="true"><path fill="currentColor" d="${MARK}" /></svg>
        <b>iKAN</b>
      </span>
      ${scene("broken", "art-broken")}
      ${scene("offline", "art-offline")}
      <h1 id="title">That didn't load</h1>
      <p id="body">Something went wrong at our end, not yours. Give it another go in a moment.</p>
      <div class="actions">
        <button class="btn primary" id="retry" type="button">
          <svg id="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-3.3-6.95" /><path d="M21 3v6h-6" />
          </svg>
          <span id="retry-label">Try again</span>
        </button>
        <a class="btn secondary" href="/">Take me home</a>
      </div>
      <a class="crisis" href="/support">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
          <path d="m4.9 4.9 4.2 4.2m5.8 5.8 4.2 4.2m0-14.2-4.2 4.2m-5.8 5.8-4.2 4.2" />
        </svg>
        <span>
          <b>Need help now?</b>
          <i>Free, confidential helplines are open right now.</i>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
      </a>
    </main>
    <script>
      (function () {
        var title = document.getElementById("title");
        var body = document.getElementById("body");
        var retry = document.getElementById("retry");
        var label = document.getElementById("retry-label");
        var spinner = document.getElementById("spinner");
        var broken = document.getElementById("art-broken");
        var offline = document.getElementById("art-offline");
        var reloading = false;

        function reload() {
          if (reloading) return;
          reloading = true;
          label.textContent = "Trying\\u2026";
          spinner.classList.add("spin");
          location.reload();
        }

        /* The same split the in-app screen makes: a failure you can retry, or no connection. */
        function sync() {
          var off = navigator.onLine === false;
          title.textContent = off ? "You're offline" : "That didn't load";
          body.textContent = off
            ? "We'll pick this up the moment you're back on. Everything saved on this phone is still here."
            : "Something went wrong at our end, not yours. Give it another go in a moment.";
          if (!reloading) label.textContent = off ? "Try anyway" : "Try again";
          broken.classList.toggle("off", off);
          offline.classList.toggle("off", !off);
        }

        retry.addEventListener("click", reload);
        window.addEventListener("online", function () {
          sync();
          reload();
        });
        window.addEventListener("offline", sync);
        sync();
      })();
    </script>
  </body>
</html>`;
}
