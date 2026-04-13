---
title: "feat: Pokemon Memory Matching Game"
type: feat
status: active
date: 2026-04-13
---

# Pokemon Memory Matching Game

## Overview

Build a browser-based memory card matching game featuring Pokemon characters. Players flip cards to find matching pairs of Pokemon, with a win condition when all matches are found. The game will be fully functional, testable in VS Code's integrated browser, and themed with actual Pokemon images and styling.

## Problem Frame

Create an interactive memory game that:
- Displays a grid of face-down cards  
- Reveals Pokemon images when cards are flipped
- Tracks matched pairs and game progress
- Provides visual feedback for matches and mismatches
- Resets for another round after completion

This is a proof-of-concept web game demonstrating core game mechanics, state management, and UI dynamics in a modern JavaScript environment.

## Requirements Trace

- R1. Game board displays a grid of face-down cards (12 or 16 cards recommended)
- R2. Clicking a card reveals a Pokemon image; matching the Pokemon character name
- R3. Two cards can be flipped simultaneously; after 1 second, non-matching pairs flip back
- R4. Matched pairs remain visible and are marked as complete
- R5. Game detects win condition when all pairs are matched
- R6. Restart button resets the game board with shuffled cards
- R7. Visual and UX feedback: animations, colors, hover states, match/mismatch indication
- R8. Pokemon images load from a reliable source (API or local assets)
- R9. Game is playable and testable in VS Code's integrated browser

## Scope Boundaries

- **Non-goals:** Multiplayer, scoring leaderboards, difficulty levels, sound effects, offline service worker caching
- **Excluded:** Mobile-specific touch optimizations (desktop-first); global state persistence beyond a session

## Context & Research

### Relevant Code and Patterns

- Fresh repository with no existing code — all patterns will be established as part of this implementation

### Technology Stack (Planned)

- **Frontend:** HTML5, CSS3, vanilla JavaScript (no framework to keep it lightweight)
- **Images:** Pokemon API (`pokeapi.co`) to fetch Pokemon data and official artwork
- **Build/Tooling:** Basic npm project with a dev server (e.g., `http-server` or local dev setup)
- **Testing:** Manual testing via VS Code browser + future Playwright/Cypress integration

### External References

- [PokéAPI](https://pokeapi.co/) — Free, public Pokemon data API (images, names, generations)
- [Memory Game UI Patterns](https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/Building_up_a_basic_demo_with_Babylon.js) — MDN game development resources
- Pokemon official artwork hosted on PokéAPI CDN (`raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/`)

## Key Technical Decisions

- **No Framework:** Use vanilla JavaScript to minimize dependencies, keep the codebase lean, and make it easy to test in browsers.
- **PokéAPI for Images:** Fetch Pokemon data including official artwork URLs dynamically instead of storing images locally, reducing bundle size.
- **CSS Grid for Layout:** Use CSS Grid for the game board to ensure responsive card positioning.
- **Shuffle Algorithm:** Implement Fisher-Yates shuffle for card randomization to ensure fair gameplay.
- **State Management:** Keep game state in a single `GameState` object (cards, flipped, matched, gameOver); update DOM reactively.

## Open Questions

### Resolved During Planning

- **Number of cards:** Start with 12 cards (6 matching pairs) for MVP; scalable to 16+ later
- **Card dimensions:** Fixed card size (100px × 100px) for simplicity; responsive size can be added later
- **Flip animation:** CSS transition with 90° rotation to reveal card back → face
- **API rate limits:** PokéAPI has generous limits (~100 requests/min); acceptable for this use case

### Deferred to Implementation

- **Performance optimization:** Whether card image preloading is needed (depends on first-run latency observed in testing)
- **Accessibility (a11y):** Keyboard navigation, ARIA labels — good to add but not blocking MVP
- **PWA / Offline mode:** Can be added post-MVP if desired

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```
User starts game
    ↓
Load 12 random Pokemon from API
    ↓
Create card pairs (2 cards per Pokemon)
Shuffle deck using Fisher-Yates
    ↓
Render 12 face-down cards on board (CSS Grid 3×4)
    ↓
User clicks card
    ↓
Flip card with animation → reveal Pokemon image
    ↓
Can flip a second card?
    ├─ Yes → flip second card
    │        ├─ Match? → mark both as matched, add score
    │        └─ No match? → wait 1s, flip both back face-down
    └─ No → wait for player to click another card
    ↓
All cards matched?
    ├─ Yes → show "You Won!" message, show restart button
    └─ No → continue game
    ↓
Player clicks "Restart"
    └─ go back to "Load 12 random Pokemon"
```

## Implementation Units

- [ ] **Unit 1: Project Setup and HTML Structure**

**Goal:** Initialize the project with npm, establish HTML structure, and set up basic styling scaffolding.

**Requirements:** R1, R7, R9

**Dependencies:** None

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `styles.css`
- Create: `game.js`

**Approach:**
- Set up `package.json` with basic metadata and dev server (`http-server` or `live-server`)
- Create a single-page HTML layout: container div, game board grid div, restart button, title
- Establish CSS Grid 3×4 layout for 12 cards
- Create basic card styling: face-down appearance (solid color/pattern), hover effect
- Scaffold `game.js` with empty `GameState` object and initialization function

**Patterns to follow:**
- Standard npm project structure: source files in root or `src/` directory
- Single HTML entry point, self-contained CSS and JavaScript files

**Test scenarios:**
- Happy path: Page loads, displays 12 face-down cards in a 3×4 grid, restart button is visible
- Visual: Cards are clickable (cursor changes to pointer on hover), grid is centered and responsive
- Edge case: Window is resized; grid remains proportional and centered

**Verification:**
- Open `index.html` in VS Code browser; see 12 gray face-down cards in a grid
- Hover over cards; see hover effect (color change or shadow)
- Restart button is present and clickable (no-op at this stage)

---

- [ ] **Unit 2: Fetch Pokemon Data from API**

**Goal:** Load 12 random unique Pokemon from PokéAPI and prepare card data structure.

**Requirements:** R8, R1

**Dependencies:** Unit 1

**Files:**
- Modify: `game.js`

**Approach:**
- Create async function `fetchRandomPokemon(count)` that:
  - Generates `count` random Pokemon IDs (1–905 to cover all generations)
  - Fetches Pokemon data from PokéAPI (`https://pokeapi.co/api/v2/pokemon/{id}/`)
  - Extracts name, id, and official artwork image URL (`sprites.other.official-artwork.front_default`)
  - Returns array of Pokemon objects
- Build card pairs: for each Pokemon, create two card objects with unique IDs but same Pokemon reference
- Store in `GameState.cards` array
- Call during game initialization

**Execution note:** Start with a manual test (console.log the fetched data) before wiring to the UI.

**Patterns to follow:**
- Modern `async/await` for API calls, no callbacks
- Centralize API URLs as constants at the top of `game.js`
- Handle API errors gracefully (console warning, fallback to hardcoded Pokemon if API is down)

**Test scenarios:**
- Happy path: `fetchRandomPokemon(12)` returns array of 6 unique Pokemon, each appearing twice in the card list
- Edge case: Two calls to `fetchRandomPokemon()` return different sets of Pokemon (proper randomization)
- Error path: API is unavailable; function logs an error and falls back to a set of 6 hardcoded Pokemon (Pikachu, Charizard, Blastoise, Venusaur, Dragonite, Gengar)

**Verification:**
- Open browser console; call `fetchRandomPokemon(12)` manually; inspect returned array — see 6 unique Pokemon, each with name, id, and image URL
- Image URLs are valid and return 200 OK (can test by opening one in a new tab)

---

- [ ] **Unit 3: Implement Card Flipping Logic**

**Goal:** Add click event listeners to cards and implement flip animation with state tracking.

**Requirements:** R2, R3, R7

**Dependencies:** Unit 1, Unit 2

**Files:**
- Modify: `game.js`
- Modify: `styles.css` (add flip animation and flipped state styles)

**Approach:**
- Create `CardElement` class or object with methods: `flip()`, `unflip()`, `lock()`, `unlock()`
  - Track each card's state: `isFlipped`, `isLocked`, `isMatched`
- Attach click event listener to each card element in the DOM
- On click:
  - If card is locked or already matched, ignore
  - Call `flip()` to reveal the card
  - Add the card to a `flippedCards` array in `GameState`
  - If two cards are flipped, trigger match check logic (Unit 4)
- Implement CSS animation: rotate card 90° to show front, transition smoothly
- Restrict flipping to max 2 cards at a time with `isLocked` flag

**Execution note:** Implement flip logic first, test that cards visually flip and unfold. Match logic comes in Unit 4.

**Patterns to follow:**
- Use CSS transforms for flip animation (3D rotation or simple fade/opacity)
- Keep card state in a data structure; update DOM based on that state
- Use event delegation if many cards are present

**Test scenarios:**
- Happy path: Click card 1 → card flips, reveals Pokemon image; click card 2 → card 2 flips; both remain revealed
- Edge case: Click card 1, immediately click card 3 (before match check); card 3 flip is blocked (locked state prevents it)
- Locked state: After card 1 and 2 are flipped, further clicks are ignored until lock is released

**Verification:**
- Click a card; see 90° rotation animation and Pokemon image appear
- Click a second card; see it flip and reveal; both cards stay visible
- Click a third card while two are flipped; nothing happens (click is ignored due to lock)

---

- [ ] **Unit 4: Implement Match Detection and State Reset**

**Goal:** Detect matching pairs, mark them as matched, unflip non-matching pairs, and manage card lock state.

**Requirements:** R4, R5, R3

**Dependencies:** Unit 3

**Files:**
- Modify: `game.js`

**Approach:**
- Create function `checkMatch(card1, card2)`:
  - Compare Pokemon IDs of the two cards
  - If match: call `card.setMatched(true)` for both cards, update score
  - If no match: set a 1-second timeout, then call `unflip()` on both cards
- After either outcome, release lock so player can continue
- Track matched pairs count; when count equals half the total cards, trigger win condition
- Implement `resetGame()` to:
  - Fetch new Pokemon shuffled deck
  - Reset all cards to unflipped, unlocked, unmatched state
  - Clear flipped cards array

**Patterns to follow:**
- Use `setTimeout` for the unflip delay; store timeout ID for cleanup if needed
- Keep win detection simple: `matchedCount * 2 === totalCards`

**Test scenarios:**
- Happy path: Click two matching Pokemon cards → both remain visible, marked as matched
- Happy path: Click two non-matching cards → both flip back after 1 second
- Integration: Match 5 pairs (10 clicks) → win condition fires, "You Won!" message appears
- Edge case: Click cards very fast; queueing logic handles multiple-card flips gracefully without double-matching

**Verification:**
- Matching pair: Click Pikachu and Pikachu (same Pokemon) → both stay revealed, marked with a "matched" class (e.g., opacity 0.5 or green tint)
- Non-matching pair: Click Pikachu and Charizard → both flip back within 1 second
- All pairs matched: After matching all 6 pairs, win message appears

---

- [ ] **Unit 5: Implement Win Condition UI and Restart**

**Goal:** Display "You Won!" message when all pairs are matched and allow player to restart the game.

**Requirements:** R6, R7, R5

**Dependencies:** Unit 4

**Files:**
- Modify: `game.js`
- Modify: `index.html` (add win message container)
- Modify: `styles.css` (add win message styling)

**Approach:**
- Create `showWinMessage()` function that displays a modal or overlay with "You Won!" text and a restart button
- Wire restart button to `resetGame()` from Unit 4
- Add CSS animations for message fade-in and button hover effects
- Hide message by default; show only when `GameState.gameOver === true`

**Patterns to follow:**
- Use CSS classes to show/hide win message (e.g., `.win-message--visible`)
- Keep reset logic centralized; restart button simply calls `resetGame()`

**Test scenarios:**
- Happy path: Match all 6 pairs → win message appears with restart button visible
- Interaction: Click restart button → game resets, board is cleared, new Pokemon are fetched and shuffled
- UX: Win message is centered, readable, with clear button text ("Play Again", "Restart", etc.)

**Verification:**
- Complete all matches; win message appears with text and button
- Click restart; board is cleared, new game starts with new Pokemon

---

- [ ] **Unit 6: Browser Testing in VS Code**

**Goal:** Validate the game is fully playable and functional using VS Code's integrated browser; create simple test checklist.

**Requirements:** R9 (all functionality)

**Dependencies:** Units 1–5 (full game implementation)

**Files:**
- Create: `TEST_CHECKLIST.md` (document manual test scenarios)

**Approach:**
- Set up a dev server (if not already running from Unit 1)
- Open the game URL in VS Code's built-in browser (or any browser)
- Perform manual end-to-end test:
  1. Load game → see 12 face-down cards
  2. Click cards → flip and reveal Pokemon images
  3. Match 2–3 pairs → verify matched cards stay visible
  4. Non-match cards → verify they flip back after 1 second
  5. Play until all pairs are matched → verify win message appears
  6. Click restart → verify board resets with new Pokemon
- Document any bugs or edge cases found
- Take a screenshot or screen recording of successful gameplay for documentation

**Execution note:** Manual testing is sufficient for MVP; automated tests (Playwright, Cypress) can be added later.

**Test scenarios:**
- Complete game flow: start → flip cards → match pairs → win → restart
- Error recovery: if an API call fails, fallback Pokemon set loads and game is still playable
- Performance: page loads within 2 seconds, shuffle/reset is instantaneous

**Verification:**
- Game runs without console errors
- All cards flip smoothly, images load and display
- Matching logic works as expected
- Win condition triggers correctly
- Restart fully resets the game

---

## System-Wide Impact

- **Unchanged invariants:** This is a new game feature; no existing interfaces or APIs are affected. The repository remains a single-page web app with no backend dependencies.
- **Future extensibility:** Game state and logic are modular; difficulty levels (16+ cards, tougher shuffle patterns) can be added without refactoring core units

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| PokéAPI may be slow or unreachable | Implement fallback hardcoded Pokemon set; display loading spinner while fetching |
| Pokemon image URLs may 404 | Pre-validate URLs in `fetchRandomPokemon()`; use alternative sprite sources if needed |
| Flip animation performance on older devices | Use CSS transforms instead of expensive DOM reflows; test on slower machines if needed |

## Documentation & Notes

- **Browser Testing:** Use VS Code's integrated browser or open `index.html` directly in Chrome/Firefox/Safari  
- **Dev Server:** Recommend `npx http-server` or `npm run dev` (to be defined in package.json)  
- **Future Enhancements:** Sound effects, difficulty levels, multiplayer, leaderboards (documented as non-goals for MVP)

## Sources & References

- **PokéAPI:** https://pokeapi.co/
- **MDN Game Dev:** https://developer.mozilla.org/en-US/docs/Games
- **CSS Transforms & Animations:** https://developer.mozilla.org/en-US/docs/Web/CSS/transform

