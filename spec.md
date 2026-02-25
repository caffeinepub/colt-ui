# Specification

## Summary
**Goal:** Redesign the Proxy tab to display a centered Google-style landing layout when no URL is loaded, matching the existing dark neon/cyberpunk aesthetic.

**Planned changes:**
- When no URL is loaded, show a centered landing layout in the Proxy tab with the existing Colt UI logo and "Colt UI" text displayed inline next to it
- Render a wide, prominent URL/search input bar below the logo, styled like Google's search bar but with glassmorphism and neon glow effects matching the existing cyberpunk theme
- Include a "Go" submit button inline with or beneath the search bar
- Hide the centered landing layout once a URL is submitted and loaded, replacing it with the existing full-area iframe
- Keep the status bar showing the current proxied URL when an iframe is active
- Preserve all existing proxy iframe loading and error-handling logic

**User-visible outcome:** Users see a polished Google-style landing page in the Proxy tab with the Colt UI logo and a prominent neon-styled search bar; submitting a URL loads the proxy iframe as before.
