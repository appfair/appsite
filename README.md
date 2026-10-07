# App Fair appsite

An example reusable daysite theme and independent Astro website. It wraps daysite's original
header to retain language/theme/QR controls, supplies the App Fair badge and appfair.net link,
replaces the footer with localized App Fair information, and adds a Markdown journal built
with Astro content collections. App downloads, screenshot carousels, galleries, platform
choices, and release channels still come from daysite's publication data.

The default daysite theme remains unchanged. This example does not modify Games-Fair or
Day-Showcase, and selecting it is opt-in.

## Select the theme

After publishing this repository, an app can add to `website/site.toml`:

```toml
[theme]
repository = "appfair/appsite"
ref = "main" # Prefer a tested tag or commit for production.
```

Use the updated daybrite/actions and daybrite/daysite revisions. The website workflow checks
out this theme, installs this npm lockfile, stages publication assets in daysite/public,
and builds this Astro project into daysite/dist. The configuration module is
[daysite.config.mjs](daysite.config.mjs). Paths in it belong to this checkout.

A project can add its own `website/daysite.config.mjs` to override any theme component, append
CSS/assets, replace routes, or take ownership of its source tree. A project-owned
`website/astro.config.mjs` takes precedence over this theme's Astro configuration.
See the [daysite customization contract](https://github.com/daybrite/daysite/blob/main/docs/customization.md).

## Local preview, without changing an app

With sibling checkouts of daysite, appsite, and an app that has generated website metadata:

```sh
npm ci
export DAYSITE_ROOT=/absolute/path/to/daybrite/daysite
export DAYSITE_CONFIG=/absolute/path/to/app/website/site.toml
export DAYSITE_THEME="$PWD"
export DAYSITE_PUBLIC_DIR="$DAYSITE_ROOT/public"
export DAYSITE_OUT_DIR="$PWD/dist"
node "$DAYSITE_ROOT/scripts/build-site.mjs" build
node "$DAYSITE_ROOT/scripts/build-site.mjs" dev --host 127.0.0.1 --port 4322
```

`DAYSITE_THEME` lets you try this theme even if the app's site.toml has no theme selection.
The build-site launcher supplies DAYSITE_ROOT itself; it is included above for `npm run build`
and direct Astro commands. Before building, generate appindex/gallery/channels using daysite's
normal generation tools. Use an isolated public directory for side-by-side previews and pass
that same directory to generation with `--public-dir`.

For a small offline test:

```sh
node "$DAYSITE_ROOT/scripts/create-fixture.mjs" /tmp/appsite-fixture
export DAYSITE_CONFIG=/tmp/appsite-fixture/website/site.toml
export DAYSITE_PUBLIC_DIR=/tmp/appsite-fixture/public
npm run build
npm run check
npm test
node "$DAYSITE_ROOT/scripts/check-customization.mjs" "$PWD/dist" appfair
```

The fixture contains synthetic app data and tiny synthetic screenshots. It is not a real
Games-Fair release or shipped publication content. Browser tests require Chromium installed
through daysite's Playwright dependency.

## Branding, content, and Astro integrations

- Edit `src/theme.css` for brand/layout styles. The app's existing website/theme.css is applied
  last, retaining its individual app identity.
- Replace Header, Footer, or any daysite component in daysite.config.mjs. Original imports
  use `daysite/components/Name.astro`; selected imports use `@daysite/components/Name`.
- Add Markdown under `src/content/blog/`. The collection validates title, summary, and date;
  index and dynamic post routes are under `/en/blog/`. Articles are publication content,
  intentionally English in this example. Other languages can have their own collections/routes.
- Add ordinary Astro pages under src/pages. Edit astro.config.mjs to merge MDX, RSS, or your
  preferred Astro integrations. Commit package-lock.json when adding dependencies. The
  renderer and this theme currently use Astro 5.
- Theme-owned UI strings live in `src/strings.json`, with complete catalogs for Games-Fair's
  13 languages. Components use generated symbolic accessors, without an English fallback for
  missing locales. Add translations before using this theme with another locale set.
- Bundled vectors are registered in `src/assets.json` and accessed through the generated
  resource API. Run `npm run resources` after changing catalogs or registrations. CI checks
  the committed generated module and exercises locale resolution.

The logo is the existing App Fair badge from
`appfair.org/public/assets/icons/appfair-icon.svg`; localized footer text comes from
`appfair.net/site/siteinfo.yaml`. Their existing provenance and rights apply; this example
makes no new licensing claim over that material.

## CI

.github/workflows/ci.yml checks generated resources and theme tests, builds this independent
Astro project from synthetic publication data, runs Astro's type checker, then exercises
branding, Markdown posts, app controls, responsive/RTL pages, galleries, downloads, release
channels, and deployment relocation in Chromium. It validates sites; it does not deploy them.

## First publication and upgrades

Publish the updated daysite renderer before this theme: this theme's CI checks out
`daybrite/daysite` at `main` and uses the customization API. Publish this directory as
`appfair/appsite` with its source, generated resource module, lockfile, and CI workflow;
leave `node_modules/`, `.astro/`, `public/`, and `dist/` untracked.

Release the updated actions workflow at the revision app workflows select (commonly `v1`)
before apps select this theme remotely. Apps can then add the theme table above and publish
through their existing Day app workflow. Pin tested theme tags or commits independently
of the renderer's `daysite-version`. Existing apps using the default daysite theme need
no changes. See Day's [App websites guide](https://daybrite.dev/docs/websites) for Pages
setup and optional custom domains.
