# fxRate Web

A Next.js frontend for [fxRate](https://github.com/realsunyz/fxrate).

This app lets users compare foreign-exchange rates from Chinese banks and card networks in a simple web interface.

It is built with Next.js App Router, talks to the standalone `fxRate` backend, and uses Cloudflare Turnstile for captcha protection.

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

| Variable                         | Default                 | Description        |
| -------------------------------- | ----------------------- | ------------------ |
| `NEXT_PUBLIC_FXRATE_API`         | `http://localhost:8080` | fxRate backend URL |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | —                       | Turnstile site key |
