---
name: gametime
description: Create a Pokemon memory game with GitHub Pages deployment using GitHub Actions in one shot
argument-hint: "[Optional: custom Pokemon list, difficulty settings, or GitHub username override]"
---

# GameTime Skill: Deploy Pokemon Memory Game to GitHub Pages

Create a fully functional Pokemon memory game with CSS3 animations, localStorage persistence, and automated GitHub Pages deployment—start to finish.

## Overview

The **gametime** skill executes this workflow end-to-end:

1. **Generate Game Files** → (HTML, CSS, JavaScript with game logic)
2. **Initialize Git & GitHub** → (repo creation, initial commit, push)
3. **Make Repository Public** → (critical: GitHub Pages requires public repos)
4. **Setup Deployment Strategy** → (/docs folder on main branch for simplicity)
5. **Enable GitHub Pages** → (API configuration pointing to /docs source)
6. **Deploy & Verify** → (automated workflow + live site verification)

## Quick Start

**Invoke without arguments:**
```
/gametime
```

**With custom settings:**
```
/gametime: pokemon=custom_list, difficulty=easy/medium/hard, username=your-github-handle
```

---

## Workflow Phases

### Phase 1: Game File Generation

#### 1.1 Create HTML Structure (`index.html`)

```html
<!-- Game container with header (title, stats), game grid, modals -->
<!-- Key elements:
     - Stat display (Moves, Matches, Time)
     - Dynamic grid for cards (responsive based on difficulty)
     - Difficulty modal for level selection
     - Win modal for game completion
     - Restart & Change Difficulty buttons
-->
```

**Success Criteria:**
- ✅ File loads without errors
- ✅ Header displays title and stat labels
- ✅ Game grid container is empty and ready for JavaScript population
- ✅ Modals are hidden by default

#### 1.2 Create Stylesheet (`styles.css`)

**Must Include:**
- CSS3 3D card flip animations (`transform: rotateY()`)
- Responsive grid layouts for 3 difficulty levels (4x4, 4x6, 6x6)
- Match animation (checkmark ✓ overlay)
- Mismatch animation (shake effect)
- Gradient backgrounds
- Mobile-responsive flexbox

**Success Criteria:**
- ✅ Card flip animation is smooth (>300ms)
- ✅ Grid adapts to viewport (mobile first)
- ✅ Colors have sufficient contrast (WCAG AA)

#### 1.3 Create Game Logic (`game.js`)

**ES6 Class Structure:**
```javascript
class PokemonMemoryGame {
  constructor() {
    // 35+ Pokemon dataset from PokeAPI
    // Initialize game state (flipped, matched, moves, time)
  }
  initializeGame() { /* Reset and randomize cards */ }
  flipCard(index) { /* Handle card click, update UI */ }
  checkMatch() { /* Compare flipped pair, trigger animations */ }
  handleMatch() / handleMismatch() { /* Apply results */ }
  startTimer() / endGame() { /* Time tracking */ }
}

// Instantiate and bind to difficulty buttons
```

**Pokemon Dataset (35+ minimum):**
- Pikachu, Charizard, Eevee, Gible, Togepi
- Machop, Totodile, Onix, Cyndaquil, Zangoose
- Bagon, Cubone, Growlithe, Psyduck, Charmander
- Oshawott, Blastoise, Bulbasaur, Mudkip, Ponyta
- Dratini, Snorlax, Jigglypuff, Abra, Kipper
- (+ 10 more for depth)

**Success Criteria:**
- ✅ Cards flip on click with animation
- ✅ Matching logic works (correct pairs stay flipped, mismatches flip back)
- ✅ Move counter increments correctly
- ✅ localStorage persists best score per difficulty
- ✅ Difficulty switching resets game state
- ✅ Timer tracks elapsed seconds

---

### Phase 2: Git & GitHub Initialization

#### 2.1 Create Local Git Repository

```bash
cd /workspace/devdaysweb
git init
git add .
git commit -m "feat: add Pokemon Memory Game with three difficulty levels"
```

**Success Criteria:**
- ✅ `.git` folder exists
- ✅ First commit created with all game files

#### 2.2 Create GitHub Repository (if needed)

Using GitHub CLI:
```bash
gh repo create devdaysweb --public --remote=origin --source=. --remote-name=origin
```

**⚠️ CRITICAL: Repository MUST be public**
- GitHub Pages on free plan requires public visibility
- Private repos cannot use GitHub Pages without enterprise plan
- Verify: `gh repo view --json visibility` returns `"PRIVATE"` → must fix in next step

#### 2.3 Push to GitHub

```bash
git branch -M main
git push -u origin main
```

**Success Criteria:**
- ✅ All files on `origin/main` branch
- ✅ Repository visible at https://github.com/[username]/devdaysweb

---

### Phase 3: Repository Configuration

#### 3.1 Verify & Set Visibility to Public

```bash
# Check current visibility
gh repo view --json visibility

# If PRIVATE, change to public
gh repo edit --visibility public --accept-visibility-change-consequences
```

**⚠️ CRITICAL CHECKPOINT:**
Before proceeding, confirm with user:> _"Repository is now PUBLIC. Anyone with the link can view the code. Continue?"_

**Success Criteria:**
- ✅ Repository visibility is `PUBLIC`
- ✅ User confirms proceeding

#### 3.2 Create Deployment Folder

Create `/docs` folder locally:
```bash
mkdir -p docs
cp index.html docs/
cp styles.css docs/
cp game.js docs/
touch docs/.nojekyll
```

Commit and push:
```bash
git add docs/
git commit -m "docs: add Pokemon game to docs folder for GitHub Pages"
git push origin main
```

**Why /docs folder?**
- Simpler than gh-pages branch (fewer moving parts)
- No separate branch to maintain
- Source of truth is main branch
- Automatic Jekyll bypass with `.nojekyll`

**Success Criteria:**
- ✅ `/docs` folder exists with all game files
- ✅ Commit pushed to main

---

### Phase 4: GitHub Actions Workflow

#### 4.1 Create Deployment Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Update docs folder
        run: |
          mkdir -p docs
          cp index.html docs/ || true
          cp styles.css docs/ || true
          cp game.js docs/ || true
          touch docs/.nojekyll
      
      - name: Commit and push updates
        run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"
          git add docs/
          git diff --cached --quiet || (git commit -m "chore: update docs for Pages" && git push origin main) || true
```

Commit and push:
```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deployment workflow"
git push origin main
```

**Success Criteria:**
- ✅ Workflow file exists at `.github/workflows/deploy.yml`
- ✅ Workflow appears in GitHub Actions tab
- ✅ Workflow executes without errors

---

### Phase 5: Enable GitHub Pages via API

#### 5.1 Configure Pages Source

Using GitHub CLI API call:

```bash
gh api repos/[username]/devdaysweb/pages \
  -X POST \
  -F source[branch]=main \
  -F source[path]=/docs
```

**Expected Response:**
```json
{
  "url": "https://api.github.com/repos/[username]/devdaysweb/pages",
  "status": null,
  "source": {
    "branch": "main",
    "path": "/docs"
  },
  "html_url": "https://[username].github.io/devdaysweb/"
}
```

**Troubleshooting:**
| Error | Cause | Fix |
|-------|-------|-----|
| `Your current plan does not support GitHub Pages` | Repo is private | Run Phase 3.1: make repo public |
| `Not Found` | Repository doesn't exist | Verify repo created in Phase 2.2 |
| `Unprocessable Entity` | Pages already enabled | OK—API returns 422, Pages still works |

**Success Criteria:**
- ✅ API call returns 201 Created or 422 (already exists)
- ✅ GitHub Pages settings show source as `main` branch `/docs` path

---

### Phase 6: Deployment & Verification

#### 6.1 Wait for Pages Build

GitHub Pages typically builds within 30-60 seconds after enabling.

```bash
sleep 30
```

#### 6.2 Test Live Site

Open in browser:
```
https://[username].github.io/devdaysweb/
```

**Expected:** Pokemon Memory Game loads with title, stat display, and game grid

#### 6.3 Functional Verification Checklist

Test each feature on the live site:

- [ ] **Game Loads** → Title "🎮 Pokemon Memory Game" displays
- [ ] **Stats Display** → Shows "Moves: 0 | Matches: 0 | Time: 0s"
- [ ] **Card Flipping** → Click card → flips with animation
- [ ] **Matching** → Click matching pair → cards stay flipped with ✓ checkmark
- [ ] **Mismatching** → Click non-matching pair → cards flip back (shake animation)
- [ ] **Move Counter** → Increments with each card flip
- [ ] **Match Counter** → Increments when pair matches
- [ ] **Timer** → Counts elapsed seconds
- [ ] **Difficulty Easy** → 4x4 grid (8 pairs) loads, resets counters
- [ ] **Difficulty Medium** → 4x6 grid (12 pairs) loads correctly
- [ ] **Difficulty Hard** → 6x6 grid (18 pairs) loads correctly
- [ ] **Restart Button** → Resets current difficulty game
- [ ] **Change Difficulty** → Shows modal with 3 options
- [ ] **Best Score** → Persists across page reloads using localStorage

**Success Criteria (ALL MUST PASS):**
- ✅ Game playable at live URL
- ✅ All 5 core mechanics working (flip, match, counter, timer, difficulty)
- ✅ 3 difficulty levels operational
- ✅ localStorage persistence verified

---

## Quality Criteria

### Code Quality
- ✅ No console errors
- ✅ Responsive design (mobile, tablet, desktop tested)
- ✅ Semantic HTML (ARIA labels, keyboard accessible)
- ✅ CSS animations smooth (no jank)
- ✅ JavaScript follows ES6 class patterns

### Deployment Quality
- ✅ GitHub repo is public
- ✅ GitHub Pages enabled with `/docs` source
- ✅ GitHub Actions workflow runs on every push
- ✅ All files served via HTTPS
- ✅ Site is publicly accessible (no auth required)

### Operational Quality
- ✅ Git history clean (meaningful commit messages)
- ✅ `.nojekyll` present in `/docs` (disables Jekyll)
- ✅ All game assets (PokeAPI images) load correctly
- ✅ No 404s in browser console for game files

---

## Decision Points & Branching

| Decision | Options | Recommendation |
|----------|---------|-----------------|
| **Repo Visibility** | Public vs Private | **Public** (required for free GitHub Pages) |
| **Deployment Target** | `/docs` folder vs `gh-pages` branch | **`/docs`** (simpler, main branch is source of truth) |
| **Image Source** | Self-hosted vs PokeAPI CDN | **PokeAPI CDN** (no cost, official artwork, reliable) |
| **Difficulty Count** | 2 vs 3 vs 4 levels | **3 levels** (balanced: Easy, Medium, Hard) |
| **Automation** | Manual gh-pages action vs simple workflow | **Simple workflow** (updates `/docs` on every push) |

---

## Known Issues & Workarounds

### Issue: "404: There isn't a GitHub Pages site here"

**Root Cause:** Pages not enabled via API or Pages config not pointing to `/docs`

**Fix:**
1. Verify repo is **public**
2. Run Phase 5.1 API call again
3. Wait 60+ seconds for Pages CDN to propagate
4. Hard refresh browser (Ctrl+Shift+R)

### Issue: Cards show "?" but Pokemon images don't load

**Root Cause:** PokeAPI image CDN temporarily down or network issue

**Fix:**
- Verify image URLs in `game.js` are correct format: `https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/{id}.png`
- Test image URL directly in browser
- Check browser console for CORS errors (should be none—PokeAPI allows)

### Issue: Git commits fail in Actions with "permission denied"

**Root Cause:** Workflow not configured to push back to repo

**Fix:**
- Ensure `git config user.name` and `git config user.email` set in workflow
- GitHub Actions token is auto-available in `GITHUB_TOKEN` secret (read-only by default)
- Current workflow pushes with the commit author's token (acceptable for this use case)

---

## Completion Output

When all phases complete successfully, you will have:

1. **Live Game URL:** https://[username].github.io/devdaysweb/
2. **GitHub Repository:** https://github.com/[username]/devdaysweb (public, all code visible)
3. **Automated Workflow:** On every push to `main`, `/docs` folder auto-updates
4. **Fully Playable Game:** 3 difficulty levels, best score tracking, smooth animations

**Next Steps:**
- Share the live URL with friends/family
- Customize Pokemon list in `game.js` (add more, remove some)
- Add sound effects or difficulty modifiers
- Deploy to custom domain (optional)

---

## Example Prompts to Use This Skill

```
/gametime
→ Creates Pokemon game + deploys to GitHub Pages end-to-end

/gametime: pokemon=gen5_only
→ Same workflow, but only uses Gen 5 Pokemon

/gametime: username=my-different-handle
→ Deploys to GitHub account with different username

/gametime: difficulty=hard_only
→ Game launches with Hard (6x6) as default difficulty
```

---

## Related Skills & Customizations

- [x] **git-commit** — Use for meaningful commit messages
- [x] **git-commit-push-pr** — Could replace our workflow for non-automated flow
- [ ] **feature-video** — Record a demo video of the game for your PR
- [ ] **frontend-design** — Enhance styling with animations/themes
- [ ] **test-browser** — Add Playwright tests for game mechanics
- [ ] **rclone** — Upload gameplay videos to cloud storage

