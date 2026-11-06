# CLAUDE.md

## Previewing a graph live (do this yourself, no Claude needed)

`MYexamples/preview.html` is a harness that loads the locally built JSXGraph library from `distrib/` and renders any one example from `MYexamples/103` or `MYexamples/215`, picked from a dropdown at the top of the page. It needs a real local server (not double-clicking the file) because a `file://` page can't load the sibling `distrib/` and example scripts.

For the first time:

1. Run `npm install` and then `npm run buildCore`.

To open it:

1. In a terminal, from the repo root, start a local server:
   ```bash
   cd /Users/Kyle/jsxgraph && python3 -m http.server 8123
   ```
2. Open [http://localhost:8123/MYexamples/preview.html](http://localhost:8123/MYexamples/preview.html) in your browser.
3. Use the "Example" dropdown at the top to switch between any of the graphs in `MYexamples/`.
4. When done, stop the server with `Ctrl+C` in the terminal.

If a new example file is added to `MYexamples/`, add its `course/filename` (no `.js`) to the `examples` array near the top of `preview.html`'s `<script>` so it shows up in the dropdown.

This repository is a clone of the [JSXGraph](https://jsxgraph.org/) source code. It is **not** used here to develop JSXGraph itself — it exists so that Claude has the JSXGraph library and its examples available for reference (API shape, available element types, options, etc.) while building course visualizations.

## What this project is actually for

The user creates JSXGraph visualizations ("graphs") for their own course material. When given a prompt or a set of instructions describing a graph/visualization to build, the task is to write a new JSXGraph script that fulfills it.

## The one directory that matters: `MYexamples/`

`MYexamples/` contains the user's own prior graphs — real examples of what they've built before. These are the style guide. **Always look through relevant existing files in `MYexamples/` before creating a new graph**, to match the user's conventions:

- `MYexamples/215/` — Linear Algebra course graphs
- `MYexamples/103/` — Precalculus course graphs

File naming follows the pattern `jsx_<chapter>_<section>_<short_description>.js` (e.g. `jsx_3_3_vertex_form.js`, `jsx_1_4_lin_trans.js`), matching the textbook chapter/section the graph illustrates. Match this convention for new files, using the appropriate subdirectory (`103` or `215`) — or ask which course/chapter a new graph belongs to if it isn't clear from the prompt.

Each file is a standalone JS snippet (no HTML wrapper) that calls `JXG.JSXGraph.initBoard(...)` and builds the visualization — meant to be dropped into a course page where a board `<div>` with the matching id already exists (id pattern: `<filename_without_ext>_fig`).

Observed conventions worth following, based on existing examples:
- `JXG.Options.text.useMathJax = true;` at the top when math text/labels are used.
- `boundingbox`, `axis`, `showCopyright: false` (and often `grid: false`, `showNavigation`) set explicitly on `initBoard`.
- Sliders for interactive parameters, draggable points for interactive features (e.g. `attractToGrid`, snapping).
- Small formatting helper functions (e.g. `fmt`, `fmtA`) to keep displayed numbers/expressions clean.
- MathJax-rendered `text` elements (`useMathJax: true`, `parse: false`) positioned in a board corner to show a live formula tied to slider/point state.
- Consistent, deliberate color choices (e.g. `#378ADD` blue / `#D85A30` coral for axes-like pairs, `#EF9F27`/`#854F0B` for highlighted regions) — reuse established colors rather than picking arbitrary new ones when a graph plays a similar role to a past one.
- Comments are sparse and only used to explain non-obvious intent.

When building a new graph, skim 1-2 stylistically similar existing files first (same course, same kind of concept — e.g. another transformation graph, another shifting/scaling graph) and follow their structure, naming, and visual style rather than inventing a new pattern.

## Combining multiple boards in one file

Sometimes two unrelated graphs need to sit side by side as one interactive (e.g. `jsx_1_3_vec_par.js` glues `jsx_1_3_vec` + `jsx_1_3_par`; `jsx_1_4_mvp_lin_trans.js` glues `jsx_1_4_mvp` + `jsx_1_4_lin_trans`). The pattern, established across both of those files:

- The host page still only gives the file **one** container div (`<basename>_fig`). The script sets that div to `display:flex`, injects two child `<div class="jxgbox">`s into it, and calls `initBoard` once per child.
- Each original file's code is copied in **verbatim** (colors, logic, everything) except retargeting `initBoard`'s id, and wrapped in its own `(function () { ... })();` IIFE. This is essential — both source files declare `var board`, often `var A`, etc., and without IIFE isolation the second board's `var` declarations would collide with the first's in the shared global scope.
- Never touch the two original source files when building one of these — only the new combined file.
- Each child div's sizing uses CSS `aspect-ratio` (e.g. `'1 / 1'`), **matched to that panel's own board's `boundingbox` shape**, plus explicit `height: 'auto'` on the div. Do NOT hardcode a pixel height — a fixed height doesn't scale with width, so shrinking the container (e.g. PreTeXt's `width="50%"` on `<interactive>`) distorts/squishes the content into a mismatched box. `aspect-ratio` keeps every panel's proportions correct at any width. If the two source boards' boundingboxes are already the same shape (as in the mvp/lin_trans pair, both `[-6,6,6,-6]`), both divs just get `1/1` and end up equal-sized automatically; if they differ, give each div its own ratio matching its own board.
- Set `container.style.height = 'auto'` too — the host page's own CSS otherwise gives that div a fixed height sized for a single full board, leaving dead space below two side-by-side (and therefore shorter) panels.
- Append the PreTeXt iframe-sizing fix (below) at the end of these combined files — it's needed here more than anywhere else, since a multi-panel layout is exactly the shape the PreTeXt template's per-board size assumptions get wrong.

## The PreTeXt course site (a separate project — gotchas learned by testing against it)

The user's actual course site is a separate PreTeXt/Runestone project (not in this repo), served locally for testing (e.g. `http://localhost:8144/output/course/...`). Files from `MYexamples/` get **copied** into that project's own build-output directory (something like `output/course/external/jsxgraph/<file>.js`) as part of its own build step — editing a file here does **not** instantly change what that site serves; it needs a rebuild/resync on the user's end first, then a page reload, before any fix can be verified there.

Things discovered by actually loading graphs on that site (not visible from this repo alone):

- **JSXGraph version pin**: that site loads JSXGraph from a `cdnjs.cloudflare.com/ajax/libs/jsxgraph/<version>/jsxgraphcore.js` URL pinned to an old release (1.8.0 at time of writing) — no 3D module at all. `polygon3d` needs >=1.9.0, `text3d` needs >=1.10.0 (check this repo's own `CHANGELOG.md` for exact version-introduced info on any element before assuming it'll work live). cdnjs's latest mirrored build lags this repo's `distrib/` version slightly (e.g. cdnjs had 1.13.2 when this repo was at 1.13.3) — that's fine, just not the identical patch. If a graph using 3D elements works in `preview.html` but not on the live site, **check what JSXGraph version the site's `<iframe>` actually loads first** (`window.JXG.version` in that iframe's own console) before assuming the graph code is at fault.
- **PreTeXt iframe sizing**: each `<interactive>` is rendered inside its own iframe, and that iframe's sizing fights any graph whose real content height doesn't match what the template assumes (a single full-size square board). Two separate hardcoded constraints stack: (1) the iframe's own `<body>` has a fixed `min-height` (sized for a typical single board, e.g. ~900px) from the site's CSS; (2) the parent page separately pins the actual `<iframe>` element's `height` to a fixed value matching its `width` (assuming square). Neither is something we can fix by editing that external template from here — instead, override both from inside the graph file itself, at the end of the script:
  ```js
  document.body.style.setProperty('min-height', 'auto', 'important');
  function syncIframeHeight() {
      if (window.frameElement) {
          window.frameElement.style.height = document.body.getBoundingClientRect().height + 'px';
      }
  }
  syncIframeHeight();
  window.addEventListener('load', syncIframeHeight);
  ```
  This is same-origin-safe (`window.frameElement` reaches up into the parent page from inside the iframe) and only affects this one file's own iframe — it doesn't touch the parent page's other content or its pagination.
- **Pagination / print preview**: the `?printpreview=<section>` view's `.onepage` boxes are a static fixed-height (`1056px`, `overflow: visible`) visual mockup for author review, not a live pagination engine — there's no `page-break-*`/`break-inside` CSS anywhere in that page's loaded stylesheets. Real print/PDF pagination is a separate, external step not present in this live page; a runtime JS fix like the iframe-resize above will only affect a print/PDF pipeline that actually executes embedded JavaScript before laying out pages (e.g. a headless-browser export) — it's inert (neither helps nor breaks anything) against pipelines that render HTML to PDF without running scripts.
- **MathJax via cdnjs is incomplete**: `cdnjs.cloudflare.com`'s mirror of the `mathjax` npm package only hosts the pre-combined bundle files (`tex-mml-chtml.js`, etc.), **not** the individual `input/tex/extensions/*.js` component files that a custom `loader.load`/`packages` config (e.g. adding `color`, `mathtools`, `newcommand`, `textmacros`) needs to fetch on demand — those requests 404 there. `cdn.jsdelivr.net/npm/mathjax@<version>/...` mirrors the **full** npm package instead (verified: all the `input/tex/extensions/*.js` files exist there) — use jsdelivr, not cdnjs, for MathJax whenever a custom `loader`/`packages` config is involved. A failed package load can be silent (the command just doesn't work, e.g. `\color` renders as plain error-red text with no console error) or fatal (an unrelated bug in a `startup.ready` override compounding it can abort MathJax's entire startup, so nothing typesets at all) — check the console for `MathJax(...): Can't load "..."` messages when something isn't rendering.
- **MathJax CHTML vs SVG output**: `tex-mml-chtml.js` draws math using MathJax's own web font, which occasionally mispositions combining accents (e.g. `\vec{v}_1`'s arrow rendering over the subscript instead of over `v`) in a way that's browser/environment-dependent and doesn't reproduce everywhere. `tex-mml-svg.js` draws every glyph as an explicit vector path instead, which can't be affected by font substitution — prefer it (`https://cdn.jsdelivr.net/npm/mathjax@<version>/tex-mml-svg.js`) for consistent rendering across browsers.

## 3D graphs: zooming

For `view3d` boards, the on-screen scale is controlled by the 3D bounding cube (the third argument to `view3d`, e.g. `[[-6,6],[-6,6],[-3,3]]`) relative to the fixed viewport rectangle — `view3d` auto-fits that cube into the viewport. **Shrink the cube's numeric range to zoom in** (same content, smaller nominal range, so it fills more of the viewport); grow it to zoom out. The viewport rectangle itself is usually already maxed out within the board's `boundingbox`, so it isn't the zoom lever.

## Editing scope — hard constraint

**Only files inside `MYexamples/` may be created or edited.** The rest of this repository is the vendored JSXGraph library/build system and must be left untouched — do not modify `src/`, `distrib/`, `examples/`, config files, `package.json`, etc.

The one exception is `.claude/launch.json`, which configures the local preview server described above — it's tooling, not library or example content, and may be created/edited if the preview setup needs to change.

## No git commands

**Never run any `git` command in this repository** (no `git status`, `git add`, `git commit`, `git diff`, etc. — none of it), even for read-only inspection. This repo is a plain file clone for reference purposes, not something to version-control changes into.
