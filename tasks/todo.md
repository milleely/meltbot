# MeltBot Build Tracker

## Day 1 (Feb 26) -- Foundation + Lock Screen
- [x] Initialize Next.js project, deploy to Vercel
- [x] Build the lock screen (dark, matches the WS aesthetic loosely)
- [x] Add "Resolve Now" button that transitions to chat
- [x] Set up Claude API route
- [x] Test basic conversational flow in terminal

## Day 2 (Feb 27) -- Chat Interface Polish
- [x] Create ProgressBar component (4-step visual indicator)
- [x] Add simulated "Attach Photo ID" button to ChatInterface
- [x] Wire step advancement logic into ChatInterface
- [x] Device frame wrapper (phone silhouette on desktop)
- [x] 3D gradient lock icon
- [x] Change "frozen" to "locked" in lock screen
- [x] System prompt tone fix (confident, not investigative)
- [x] "MeltBot is reading your case..." loading state
- [x] Contextual action buttons via response tags ([REQUEST_DOCUMENT], [REQUEST_CONFIRM])
- [x] Parse [CASE_SUMMARY] from Claude's output, hide JSON from client
- [x] Fix progress bar advancement for non-tagged steps (2 and 3)
- [x] Realistic flag reason (agent only knows what compliance surfaces)
- [x] Case status screen (case ID, timeline, estimated resolution)
- [x] Auto-transition from chat to status screen after completion
- [x] Test full conversation flow end to end

## Day 3 (Feb 28) -- Analyst View + Summary Generation
- [ ] Build analyst case summary card
- [ ] Add approve/escalate buttons with confirmation states
- [ ] Build view toggle (client view / analyst view)
- [ ] Connect chat completion to analyst view population

## Day 4 (March 1) -- Polish + Record
- [ ] Mobile responsiveness pass
- [ ] Loading states, error handling
- [ ] Test with 2-3 people for usability
- [ ] Record Loom walkthrough as backup
- [ ] Deploy final version to Vercel
- [ ] Dry run the full demo presentation
