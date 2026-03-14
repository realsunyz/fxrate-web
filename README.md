# fxRate Web

A Next.js frontend for [fxRate](https://github.com/realsunyz/fxrate).

## Quick Start

### Prerequisites

- Node.js 24 or later
- pnpm

### Local Development

```bash
pnpm install
pnpm dev
```

## Configuration

> [!IMPORTANT]
> Always deploy behind HTTPS and enable captcha in production to prevent potential attacks and unauthorized queries.

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_FXRATE_API` | `http://localhost:8080` | fxRate backend URL |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | — | Turnstile Sitekey |
| `AUTH_BYPASS_KEY_ID` | — | RS256 Key ID |
| `AUTH_BYPASS_PRIVATE_KEY` | — | RS256 Private Key |
