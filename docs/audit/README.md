# Audit evidence

See ../PORTFOLIO_AUDIT.md for prioritized findings and limitations.

- BRAIN_OBJECTS.csv: all 134 public records; asset integrity, renderer, source media weight, specific content flags, desktop and mobile expansion results. Four private records deliberately omitted.
- BRAIN_RENDER_CHECKS.json: mobile expansion widths and broken-image observations, without copying full object contents.
- ROUTE_CHECKS.json: 13 routes plus invalid slug, desktop/mobile, headings, image failures and overflow candidates. Overflow candidates include intentional offscreen states; consult the audit for confirmed defects.
- INTERACTION_CHECKS.json: private record exposure booleans (no private text), filter counts, focus behavior and reduced-motion image changes.
- Screenshots: current normal-motion Home, Brain preview, mobile Brain, tablet Home and broken tablet float layout.

The dev-server badge is not site UI. Local raw screenshots and inspection scripts are in /tmp/portfolio-audit and are not part of the application. No production build, live-deployment validation or external availability checks were performed.
