# LexGPT consulting pages

Static Portuguese consulting and Enterprise landing pages. Serve this directory with any static HTTP server. The five entry points remain index.html, consultoria.html, enterprise.html, enterprise-conceitual.html and landing-v1.html.

## Brand sources

The visual authority is the LexGPT [brand kit](https://github.com/lexgpt-studio/studio/blob/79806df01877f8909b59cd2c9e28ef3aa92d8353/docs/design/brand-kit.md), [public interface guide](https://github.com/lexgpt-studio/studio/blob/79806df01877f8909b59cd2c9e28ef3aa92d8353/docs/design/interface-design.md) and [logo usage guide](https://github.com/lexgpt-studio/studio/blob/79806df01877f8909b59cd2c9e28ef3aa92d8353/docs/design/logos/README.md).

All pages load assets/brand.css. The palette in assets/tokens.css, local font declarations, font files, licenses and outlined favicons come from that source revision. Update them together when the canonical identity changes. There is no build step or runtime framework.

Use the standalone Cormorant Garamond 600 wordmark, roman Newsreader headings and Instrument Sans body text and controls. Keep primary actions square, labels in sentence case and functional symbols in Unicode. The compact LEX mark is reserved for the favicon. Static content must remain visible without reveal animations. Contract conditions and genuine process order remain content, not decorative labels.

The preserved commercial amounts, quotas, fees, evaluation periods and cancellation wording are inherited from this repository. This branding pass does not independently certify current commercial availability. It removes unsupported outcome counters, the placeholder legal citation and the extra continuous-support claim. The contact form opens an email draft; it does not send or store submissions.

## Verification

Run npm ci and npx playwright install chromium once, then npm test. To use an existing Chromium installation, set CHROMIUM_EXECUTABLE to its executable path. Tests exercise mobile navigation, keyboard FAQ disclosures and contact validation. Visual review should cover every entry point at desktop and phone widths, including the horizontally scrollable pricing comparison and expanded FAQ answers.

## Unslop audit

The pass uses the unslop catalogue and the design-taste-frontend guidance referenced by the frontend-bakeoff skill. This is one implementation against the established LexGPT identity, not a competing-design bakeoff.

| Catalogue family              | Verdict after the pass | Decision                                                                                         |
| ----------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------ |
| Visual                        | Absent                 | Removed decorative framing, floating-card shadows, glow, and the fabricated result panel.          |
| Typography                    | Absent                 | Removed eyebrows, small caps, decorative numbers and synthetic italics; retained the brand fonts. |
| Copy                          | Absent                 | Replaced the identified slogans, placeholder citation and unsupported outcome/support counters.   |
| Craft floor                   | Partly evaluated       | Browser checks cover layout, loading, keyboard behavior and contrast; not a WCAG certification.   |
| Motion                        | Absent                 | No decorative motion; smooth anchor scrolling respects reduced-motion preferences.                |
| Colour and rhythm             | Intentional exceptions | Paper and serif/sans typography are explicit brand decisions; not defaults to replace.             |
| English-language SaaS patterns | Intentional exceptions | Pricing and ordered implementation steps carry actual terms and process information.              |

Dashboard-only patterns and raster artwork families do not apply. The local Impeccable detector lacks its HTML parser dependencies and runs in degraded mode; an empty report is not proof of compliance. Rendered inspection and browser accessibility checks supplement it. Existing photography remains illustrative and is not presented as the consulting team.
