# MeltBot - Claude Code Guidelines

## Project Overview

MeltBot is an AI-powered account freeze resolution agent for a Wealthsimple AI Builder interview prototype. It replaces the dead-end account lock screen with a conversational agent that handles intake, then packages a ready-to-approve case for a human compliance analyst.

**Purpose:** Demo for March 4, 2026 interview
**PRD:** `ws-resolve-agent-prd.md`

## Stack

- **Framework:** Next.js 16 (App Router)
- **React:** 19
- **Styling:** Tailwind CSS v4 with CSS custom properties
- **AI:** Claude API via `@anthropic-ai/sdk` (claude-sonnet-4-20250514)
- **Language:** TypeScript (strict)
- **Fonts:** Geist Sans + Geist Mono (Google Fonts)
- **Deploy target:** Vercel

## Project Structure

```
app/
  page.tsx                    # Redirects / → /client
  layout.tsx                  # Root layout (fonts, metadata)
  globals.css                 # Tailwind + custom Melt color tokens
  client/
    page.tsx                  # Client view: lock screen → chat flow
  analyst/
    page.tsx                  # (TODO) Analyst dashboard
  api/
    chat/route.ts             # Claude API endpoint
  components/
    LockScreen.tsx            # Account frozen screen with "Resolve Now" CTA
    ChatInterface.tsx         # Chat UI with message bubbles
    CaseSummary.tsx           # (TODO) Analyst case summary card
    ViewToggle.tsx            # (TODO) Client/analyst view switcher
  lib/
    systemPrompt.ts           # MeltBot system prompt with scenario context
```

## Color Palette (Melt Theme)

All colors are CSS custom properties defined in `globals.css` and exposed to Tailwind via `@theme inline`. Use `melt-*` prefix classes:

| Token | Hex | Usage |
|-------|-----|-------|
| `melt-bg` | #0A0A0A | Page background |
| `melt-surface` | #1A1A1A | Cards, inputs, assistant bubbles |
| `melt-border` | #2A2A2A | Borders, dividers |
| `melt-muted` | #6B6B6B | Secondary text |
| `melt-text` | #E8E4DF | Primary text (warm off-white) |
| `melt-accent` | #C9A96E | CTA buttons, user bubbles, brand gold |
| `melt-accent-hover` | #D4B87A | Hover state for accent |
| `melt-danger` | #D4453A | Warnings, lock icon, restricted badge |
| `melt-success` | #4A9B6E | Online indicators, success states |

**Client side:** Dark mode (melt-bg). **Analyst side:** Light mode (separate palette TBD).

## Conventions

### Components
- All components in `app/components/` as default exports
- Client components use `"use client"` directive at top
- Props defined as interfaces directly above the component
- Inline Tailwind classes (no separate CSS modules)
- SVG icons inline (no icon library)

### Styling
- Tailwind utility classes only — no custom CSS beyond `globals.css`
- Mobile-first: design for 393x852 (iPhone 14 Pro) viewport, demo in Chrome DevTools
- Border radius: `rounded-xl` for buttons/inputs, `rounded-2xl` for message bubbles
- Text sizes: `text-xs` (meta), `text-sm` (body/buttons), `text-2xl` (headings)
- Spacing: `px-4 py-3` for padded sections, `gap-2`/`gap-3` for flex children

### API Route
- Single route at `/api/chat` (POST)
- Sends full message history to Claude on every call
- Empty messages array triggers initial greeting (injects "Hello")
- Returns `{ message: string }` on success, `{ error: string }` on failure
- System prompt imported from `app/lib/systemPrompt.ts`

### State Management
- React state only (useState, useRef) — no external state libraries
- Message history: `Message[]` where `Message = { role: "user" | "assistant", content: string }`
- No database, no persistence — all state is ephemeral per session

## The Scenario (Hardcoded)

- **Client:** Michael
- **Accounts:** TFSA + Chequing
- **Flag:** Duplicate account (old university email + new personal email)
- **Collection flow (4 steps):**
  1. Government photo ID
  2. Confirm duplicate account email
  3. Confirm which account to keep
  4. Acknowledge duplicate closure
- **Output:** `[CASE_SUMMARY]` JSON block when all items collected

## Key Design Decisions

- AI handles intake only — the unfreeze decision is always human (regulatory liability)
- Prototype covers one flag type (identity verification); production would need phased rollout
- No real document upload — simulated with buttons
- No auth, no database, no real Wealthsimple branding

## Commands

```bash
npm run dev          # Start dev server (default port 3000)
npm run dev -- -p 3001  # Dev on port 3001
npm run build        # Production build
npm run lint         # ESLint
```

## Environment Variables

```
ANTHROPIC_API_KEY=   # Required. Set in .env.local (gitignored)
```
## Claude Code Rules

Follow these rules for all development work.

### Planning Protocol
1. First think through the problem, read the codebase for relevant files, and write a plan to `tasks/todo.md`
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan
4. Then, begin working on the todo items, marking them as complete as you go
5. Every step of the way, give me a high-level explanation of what changes you made
6. Whenever you fix a bug or find a solution to a code problem, document it in a `lessons.md` file
7. Finally, add a review section to the `todo.md` file with a summary of the changes you made

### Simplicity Rules
- Make every task and code change as simple as possible
- Avoid massive or complex changes—every change should impact as little code as possible
- One feature per PR. If a change touches more than 3 files, pause and ask if it can be split
- Everything is about simplicity

### Quality Standards
- DO NOT BE LAZY. IF THERE IS A BUG, FIND THE ROOT CAUSE AND FIX IT
- No temporary fixes. You are a senior developer
- All fixes should only impact necessary code relevant to the task and nothing else
- Your goal is to not introduce any bugs

### Debugging Protocol
- CRITICAL: When debugging, trace through the ENTIRE code flow step by step. No assumptions. No shortcuts.
- CRITICAL: Before pushing build to production, run locally to catch all errors in one cycle or in as few cycles as needed.

### Development Notes
- Auto-save occurs on editor content changes
- Theme switching supports light/dark/system modes
- Responsive design optimized for desktop use

**This document is maintained by AI assistants working with Michael. Keep it updated as the project evolves.**