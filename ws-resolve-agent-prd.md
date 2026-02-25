# PRD: MeltBot
## Your Account Freeze Resolution Agent
### Wealthsimple AI Builder Interview Prototype

**Owner:** Michael
**Timeline:** Feb 26 - March 1, 2026 (~20-25 hours)
**Purpose:** Demonstrate AI-native system design thinking for the March 4 interview
**Stack:** Next.js, Tailwind CSS, Claude API, Vercel

---

## 1. Problem

When Wealthsimple freezes an account for unusual activity, the client hits a dead end: a locked screen with no explanation and one option -- "Call our Client Success team." What follows is 30+ minutes on hold, callbacks flagged as spam, and multi-day email chains where the client doesn't know what's needed or how long resolution will take.

This is the legacy workflow:
1. Compliance flag triggers account freeze
2. Client sees locked screen with no context
3. Client calls support, waits in queue
4. Support agent manually reviews the case, asks for documents
5. Client emails documents back and forth over days
6. Analyst reviews, makes unfreeze decision

Every step is sequential, human-dependent, and opaque to the client.

With 3M+ users and growing, this process doesn't scale. Wealthsimple's Trustpilot rating is 1.4 stars -- account freezes are the #1 complaint.

---

## 2. AI-Native Redesign

Replace the dead-end lock screen with an AI resolution agent that handles the entire intake process, then packages a ready-to-approve case for the human analyst.

### New Flow:
1. Compliance flag triggers account freeze
2. Client sees lock screen WITH context: "Here's why, and here's how to resolve it"
3. Client taps "Resolve Now" and enters a chat with the AI agent
4. Agent explains the specific flag reason and exactly what documentation is needed
5. Agent walks client through document collection step by step
6. Agent validates completeness and flags discrepancies
7. Agent generates a case summary with all evidence for the analyst
8. Human analyst reviews the package, clicks approve or escalate
9. Client gets notified of resolution

### What Changes:
| Step | Legacy | AI-Native |
|------|--------|-----------|
| Communication | Phone queue + email chains | Instant in-app chat |
| Context | "Unusual activity" (no details) | Specific flag reason + what's needed |
| Document collection | Back-and-forth over days | Single guided session |
| Analyst prep work | Manual case assembly | Pre-packaged case file |
| Client visibility | None | Real-time status |

---

## 3. What We're Building (Prototype Scope)

### Two Views

**View 1: Client Chat (mobile-first)**
- Lock screen with "Resolve Now" button (replacing "Call our Client Success team")
- Chat interface with the AI resolution agent
- Agent walks through one scenario: identity verification flag
- Client provides information conversationally
- Confirmation screen when intake is complete

**View 2: Analyst Dashboard**
- Case summary card generated from the MeltBot chat
- Client info, flag reason, documents collected, MeltBot recommendation
- Two buttons: "Approve Unfreeze" and "Escalate to Senior Analyst"
- Timestamp and audit trail

**Toggle/Split:** A simple way to switch between client view and analyst view to show both sides of the MeltBot system in the demo.

### The Scenario

One specific, realistic case based on a real experience:

> **Client:** Michael
> **Account type:** TFSA + Chequing
> **Flag reason:** Duplicate account detected. Client created a Wealthsimple account with a university email years ago. After graduating, the university email expired and was forgotten. Client later created a second account with a personal email. Wealthsimple's system flagged this as two accounts under the same identity, which violates their policy. Account frozen until resolved.
> **What's needed:** Confirmation of identity across both accounts, confirmation of which account to keep, closure of the duplicate
> **Resolution:** Once identity is verified and the client confirms which account to retain, analyst approves unfreeze and initiates duplicate account closure

### What AI Is Responsible For
- Explaining why the account was frozen in plain language
- Determining what documentation is needed based on the flag type
- Walking the client through collection step by step
- Validating that all required items have been provided
- Generating a structured case summary for the analyst
- Recommending approve vs. escalate based on completeness

### Where AI Must Stop
- The unfreeze decision itself. A compliance analyst must approve because:
  - Regulatory liability sits with Wealthsimple, not the AI
  - Wrongly unfreezing a flagged account has legal and financial consequences
  - Complex cases may involve overlapping flags (fraud + AML + identity) that require human judgment

### What Breaks First at Scale
- Flag type diversity. This prototype handles identity verification flags. In production, freeze reasons span fraud suspicion, AML triggers, regulatory holds, system errors, and combinations of these. Each requires different documentation and different routing logic. Expanding the agent's scope requires careful phased rollout -- not a big bang launch.

---

## 4. Technical Design

### System Prompt (Core)

```
You are MeltBot, a Wealthsimple account resolution agent. A client's account has been
frozen and you're helping them resolve it through chat.

SCENARIO CONTEXT:
- Client name: {client_name}
- Account types: {account_types}
- Flag reason: {flag_reason}
- Required information: {required_info}

YOUR ROLE:
1. Greet the client by name. Acknowledge this is stressful.
2. Explain clearly WHY their account was frozen -- no jargon, plain language.
3. Tell them exactly what you need from them to resolve it.
4. Walk through each required item one at a time. Don't list everything at once.
5. After each item is provided, confirm receipt and move to the next.
6. When all items are collected, summarize what happens next and expected timeline.

RULES:
- Never promise a specific resolution outcome. You collect information, a human analyst decides.
- Never share internal compliance details beyond what the client needs to know.
- If the client asks something outside your scope, say: "I want to make sure you get the right answer on that -- I'll flag it for your analyst."
- If the client gets frustrated, acknowledge it. Don't be robotic. Be human.
- Keep messages short. 2-3 sentences max per response.
- Never use em dashes.

INFORMATION COLLECTION FLOW:
1. Government-issued photo ID (driver's license or passport) to verify identity
2. Confirm the email address associated with the original (duplicate) account
3. Confirm which account they want to keep (by email or account number)
4. Acknowledge that the duplicate account will be closed and any holdings
   will need to be consolidated or withdrawn

When all items are collected, output a JSON summary block tagged with [CASE_SUMMARY]
that includes: client name, flag reason, documents/info collected (with timestamps),
client responses, recommended action (approve unfreeze + close duplicate, or
escalate with reason).
```

### API Integration
- Single Claude API call per user message (conversational, stateful via message history)
- Message history maintained in React state (no database needed for prototype)
- System prompt injected on every call with scenario context
- Parse for [CASE_SUMMARY] tag to trigger the analyst view generation

### Frontend Architecture

```
/app
  /page.tsx              -- Landing/toggle between views
  /client
    /page.tsx            -- Lock screen + chat interface
  /analyst
    /page.tsx            -- Case summary dashboard
  /api
    /chat/route.ts       -- Claude API endpoint
  /components
    /LockScreen.tsx      -- The "before" state
    /ChatInterface.tsx   -- Mobile chat UI
    /CaseSummary.tsx     -- Analyst view card
    /ViewToggle.tsx      -- Switch between client/analyst
```

### UI Design

**Client Side (Mobile-first responsive web):**
- Built as a standard responsive web app -- demo in Chrome DevTools device emulator (e.g. iPhone 14 Pro, 393x852) during the interview
- No native mobile app, no mobile-specific frameworks
- Dark background lock screen (similar to actual WS screenshot)
- "Resolve Now" button replaces "Call our Client Success team"
- Chat interface: clean, minimal, message bubbles
- MeltBot messages on left, client on right
- Document "upload" simulated with buttons ("Attach Photo ID")
- Progress indicator showing steps completed

**Analyst Side:**
- Light background, dashboard feel
- Case card with sections: Client Info, Flag Details, Documents Collected, Agent Recommendation
- Status badge: "Ready for Review"
- Two action buttons: "Approve Unfreeze" (green) and "Escalate" (orange)
- Clicking approve shows a confirmation state

**Color Palette:**
- Don't copy Wealthsimple's brand directly
- Use neutral/warm tones that suggest fintech without being a knockoff
- Dark mode for client lock screen, light mode for analyst view

---

## 5. Build Plan

### Day 1 (Feb 26) -- Foundation + Lock Screen
- [ ] Initialize Next.js project, deploy to Vercel
- [ ] Build the lock screen (dark, matches the WS aesthetic loosely)
- [ ] Add "Resolve Now" button that transitions to chat
- [ ] Set up Claude API route
- [ ] Test basic conversational flow in terminal

### Day 2 (Feb 27) -- Chat Interface
- [ ] Build mobile chat UI (message bubbles, input field, send button)
- [ ] Wire up Claude API with system prompt
- [ ] Implement message history state management
- [ ] Add simulated document upload buttons (photo ID, selfie)
- [ ] Test full conversation flow end to end

### Day 3 (Feb 28) -- Analyst View + Summary Generation
- [ ] Parse [CASE_SUMMARY] from Claude's output
- [ ] Build analyst case summary card
- [ ] Add approve/escalate buttons with confirmation states
- [ ] Build view toggle (client view / analyst view)
- [ ] Connect chat completion to analyst view population

### Day 4 (March 1) -- Polish + Record
- [ ] Mobile responsiveness pass
- [ ] Loading states, error handling
- [ ] Test with 2-3 people for usability
- [ ] Record Loom walkthrough as backup
- [ ] Deploy final version to Vercel
- [ ] Dry run the full demo presentation

---

## 6. Demo Script (Interview)

**Setup:** "After submitting Pingem, I couldn't stop thinking about how this approach applies to Wealthsimple. So I built something."

**Step 1: Show the problem (30 sec)**
Show the actual WS lock screen screenshot. "This is what 3 million Wealthsimple users see when their account gets frozen. No context, no self-service path, just 'call us.' This happened to me personally -- I waited 30 minutes, their callback got flagged as spam by my phone, and it took days of emails to resolve."

**Step 2: Show the redesign -- Client side (60 sec)**
Open MeltBot in Chrome DevTools mobile view. Show the new lock screen with "Resolve Now." Walk through the chat: MeltBot explains the duplicate account flag, collects identity verification and account preference step by step, confirms completion.

**Step 3: Show the redesign -- Analyst side (30 sec)**
Toggle to analyst view. "Everything the agent collected is packaged here. The analyst doesn't need to read email threads or assemble a case file. They review and click one button."

**Step 4: Explain the design decisions (30 sec)**
"AI handles intake, context, and packaging. The human handles the unfreeze decision because regulatory liability can't be delegated. And this only covers identity verification flags right now -- scaling to fraud and AML flags would require phased rollout, not a big bang."

---

## 7. Out of Scope

- Real document upload or OCR
- Real identity verification
- Multiple flag type scenarios
- Database / persistence
- Authentication
- Real Wealthsimple branding or data

---

## 8. Success Criteria

The prototype succeeds if during the March 4 interview:
- [ ] The panel sees a working conversational agent handling a realistic scenario
- [ ] Both sides of the system are visible (client + analyst)
- [ ] The "before vs. after" contrast is immediately clear
- [ ] Design decisions about where AI stops are articulated clearly
- [ ] It sparks a conversation about how this applies to other WS workflows
