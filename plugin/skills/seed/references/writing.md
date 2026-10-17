# Seed voice and writing

## Voice

Direct, warm, precise, calm, humble. A capable colleague: leads with the point, uses real names and numbers, explains what happened and what to do next. Never cute ("Oops!"), alarmist (caps, exclamation marks in warnings) or overconfident.

## Tone by moment

| Moment | Tone | Example |
|---|---|---|
| Empty state | Inviting, concrete | "No tokens yet. Import them from Figma or start with Seed's defaults." |
| Success | Quiet | "12 tokens published to v2.4." |
| Warning | Clear consequence | "3 components use this token. Renaming it updates all of them." |
| Error | Calm, specific, next step | "Figma didn't respond. Your changes are safe here. Try again in a minute." |
| Destructive confirm | Exact | "Delete 'brand-500'? 8 tokens point to it and will lose their value." |
| Waiting | Honest about time | "Importing 240 tokens. This takes about a minute." |
| Limits | Factual | "You've used 18 of 20 proposals this month. They reset on Nov 1." |

## Mechanics

- Sentence case everywhere. Proper nouns keep capitals.
- No em dashes: comma, colon, parentheses or two sentences.
- No emoji. Digits for numbers. Contractions are fine.
- No periods on labels, buttons, titles, tooltips, table cells.
- "You" for the reader; "we" only in system messages; an assistant says "I".
- Token and code names in mono, exactly as written.

## By element

- **Buttons**: verb + result, 1 to 4 words ("Publish 12 tokens"). Confirm buttons repeat the dialog's verb ("Delete", never "OK"). Cancel is "Cancel".
- **Links**: say where they go ("View the changelog"), never "Click here".
- **Titles**: pages are nouns ("Tokens"); dialogs are the question or task ("Delete token?").
- **Labels**: short nouns, no colon. Hints say what's expected or why. Placeholders show an example, not instructions. Mark optional fields "(optional)".
- **Empty states**: what it's for, why it's empty, one action.
- **Errors**: what happened, whether work is safe, what to do. Never blame. Inline errors under the field, on blur or submit.
- **Toasts**: past tense, no "successfully", one action at most. Errors that need action go in a Banner or inline.
- **Confirmations**: only for destructive, wide or hard-to-undo actions. If it can be undone, do it and offer Undo.

## AI assistant voice

Has a name and uses it in UI ("Ask Pluto", never "the AI"). First person, brief. Leads with the outcome, then the reason, then what's left for the person ("Review it below."). Honest about uncertainty. Never praises the user or over-apologizes. Proposes changes as a reviewable diff; a person approves.

## Words

tokens, components, modes (not skins), Light and Dark, publish (not deploy) in product UI, review and approve, delete (when permanent), sign in. No internal names (job IDs, schema types) in product copy.
