# ADEM reviewer access

Only `/work/adem-user-list` is protected. Public visitors see a short, high-level overview. ADEM original media lives in `content/protected/adem-user-list`, outside `public`, and is served only after the same server-side session check. Public work previews use an abstract seven-to-one graphic rather than protected screens.

## Configuration

`ADEM_CASE_STUDY_PASSWORD` is a server-only environment variable. A random password was generated in the ignored `.env.local`; open that file locally to retrieve/change it. Never prefix it with NEXT_PUBLIC, commit it, or put it in a URL. Set the same variable in the deployment environment before publishing. A missing variable fails closed. Restart/redeploy after rotating it; rotation invalidates previous sessions.

Reviewer sessions expire after eight hours, use a signed HttpOnly SameSite=Lax cookie, and are Secure in production. The lock button clears access. Signatures are scoped to ADEM and verified on both article and media requests. There are no individual accounts. The generated password has high entropy; no distributed login rate limiter has been added. Retain a strong generated password; configure hosting-level rate limiting if needed for public deployment.

Protected media responses are private/no-store. Protected URLs and legacy ADEM asset URLs are blocked at the shared image optimizer to prevent bypass through its cache. The authenticated page requests original assets without optimization. Production file tracing includes those private files.

Previously public copies cannot be recalled from a visitor's browser or another deployed version. When deploying, invalidate legacy CDN/image caches and verify old deployment URLs if those remain publicly reachable. This change does not deploy or alter other project access.
