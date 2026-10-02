/* The last page the server can serve: SSR itself failed, so there is no bundle, no React and no
 * app CSS behind this. Everything it needs is inline, and it still has to look like iKAN rather
 * than like a crashed server — someone who hits this may be having a bad day already.
 *
 * It does the little it can without the app: it knows whether the phone is online, says the right
 * thing either way, reloads itself the moment the connection comes back, and keeps the crisis
 * link in reach, because that is the one thing on this page that might actually matter. The
 * Google Fonts link is the same one the app uses, so the type matches when it loads and falls
 * back to the system stack when it does not. */

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

export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load — iKAN</title>
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
        --surface: #fcfdfe;
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
        padding: 24px calc(24px + env(safe-area-inset-right)) calc(24px + env(safe-area-inset-bottom)) calc(24px + env(safe-area-inset-left));
        background: var(--canvas);
        color: var(--ink);
        font: 400 15px/24px Manrope, ui-sans-serif, system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .card { width: 100%; max-width: 24rem; text-align: center; }
      .tile {
        width: 64px; height: 64px; margin: 0 auto;
        display: grid; place-items: center;
        border-radius: 20px;
        background: var(--surface);
        box-shadow: 0 1px 2px rgba(21, 23, 28, 0.06);
      }
      .tile svg { width: 34px; height: 34px; color: var(--ink); animation: breathe 4s ease-in-out infinite; }
      @keyframes breathe {
        0%, 100% { transform: scale(1); opacity: 0.9; }
        50% { transform: scale(1.06); opacity: 1; }
      }
      h1 {
        margin: 20px 0 0;
        font: 600 24px/32px Sora, ui-sans-serif, system-ui, sans-serif;
        letter-spacing: -0.01em;
      }
      p { margin: 8px 0 0; color: var(--muted); }
      .actions { margin-top: 24px; display: flex; flex-direction: column; gap: 8px; }
      .btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        height: 48px; padding: 0 24px; border-radius: 999px;
        font: 600 15px/1 Manrope, ui-sans-serif, system-ui, sans-serif;
        text-decoration: none; cursor: pointer; border: 1px solid transparent;
        -webkit-tap-highlight-color: transparent;
      }
      .primary { background: var(--ink); color: var(--surface); }
      .secondary { background: transparent; color: var(--ink); border-color: var(--line); }
      .btn:active { transform: scale(0.99); }
      .crisis {
        margin-top: 24px; display: inline-flex; align-items: center; gap: 6px;
        color: var(--crisis); font-size: 14px; font-weight: 600; text-decoration: none;
      }
      .spin { animation: spin 0.9s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
      [hidden] { display: none !important; }
      @media (prefers-reduced-motion: reduce) {
        .tile svg, .spin { animation: none; }
        .btn:active { transform: none; }
      }
    </style>
  </head>
  <body>
    <main class="card">
      <span class="tile">
        <svg viewBox="10 10 62 62" aria-hidden="true"><path fill="currentColor" d="${MARK}" /></svg>
      </span>
      <h1 id="title">This page didn't load</h1>
      <p id="body">Something went wrong while opening it. Try again, or go back home.</p>
      <div class="actions">
        <button class="btn primary" id="retry" type="button">
          <svg id="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-3.3-6.95" /><path d="M21 3v6h-6" />
          </svg>
          <span id="retry-label">Try again</span>
        </button>
        <a class="btn secondary" href="/">Go to home</a>
      </div>
      <a class="crisis" href="/support">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
          <path d="m4.9 4.9 4.2 4.2m5.8 5.8 4.2 4.2m0-14.2-4.2 4.2m-5.8 5.8-4.2 4.2" />
        </svg>
        Need help now?
      </a>
    </main>
    <script>
      (function () {
        var title = document.getElementById("title");
        var body = document.getElementById("body");
        var retry = document.getElementById("retry");
        var label = document.getElementById("retry-label");
        var spinner = document.getElementById("spinner");
        var reloading = false;

        function reload() {
          if (reloading) return;
          reloading = true;
          label.textContent = "Trying\\u2026";
          spinner.classList.add("spin");
          location.reload();
        }

        /* The same split the app makes: a failure you can retry, or no connection at all. */
        function sync() {
          var off = navigator.onLine === false;
          title.textContent = off ? "You're offline" : "This page didn't load";
          body.textContent = off
            ? "Connect to the internet and try again. Anything saved on this phone is still here."
            : "Something went wrong while opening it. Try again, or go back home.";
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
