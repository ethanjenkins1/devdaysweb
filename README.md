# 🎮 Pokemon Memory Game

A fun, interactive memory card matching game featuring Pokemon characters. Match pairs of Pokemon cards to win!

**[Play the Game →](https://ethanjenkins1.github.io/devdaysweb/)**

## 📋 Features

✨ **Pokemon-Themed Gameplay**

- 12 cards with 6 unique Pokemon pairs
- Real Pokemon images from PokéAPI
- Beautiful, modern UI with smooth animations

🎯 **Core Mechanics**

- Click cards to flip and reveal Pokemon
- Match identical Pokemon characters
- Non-matching pairs automatically flip back after 1 second
- Matched pairs stay visible and locked
- Restart button to play again with new Pokemon

🚀 **Technical Highlights**

- Vanilla JavaScript (no frameworks)
- CSS3 Grid layout with responsive design
- Real-time API integration with PokéAPI
- Smooth CSS animations and transitions
- Mobile-friendly design

## 🏃 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/ethanjenkins1/devdaysweb.git
cd devdaysweb

# Install dependencies
npm install

# Start dev server
npm start

# Open http://localhost:8080 in your browser
```bash

### Playing the Game

1. **Start** - Page loads with 12 face-down cards
2. **Flip** - Click any card to reveal the Pokemon
3. **Match** - Click a second card to find a match
4. **Win** - Match all 6 pairs to win the game
5. **Restart** - Click "Restart Game" to play again with new Pokemon

## 🛠️ Project Structure

```
.
├── index.html          # Game markup
├── styles.css          # Game styling and animations
├── game.js             # Game logic and mechanics
├── package.json        # Dependencies and scripts
├── TEST_CHECKLIST.md   # Complete test documentation
└── docs/
    └── plans/          # Implementation plans
```

## 🚀 Deployment

This project is automatically deployed to GitHub Pages via GitHub Actions on every push to `main`.

- **Live Site:** https://ethanjenkins1.github.io/devdaysweb/
- **Workflow:** `.github/workflows/deploy.yml`

The workflow:
- Triggers on every push to main branch
- Installs dependencies
- Verifies game files
- Deploys to GitHub Pages

### Manual Deploy

Push to `main` branch:
```bash
git add .
git commit -m "Update game"
git push origin main
```

GitHub Actions will automatically deploy within 1-2 minutes.

## 📊 Tech Stack

- **Language:** JavaScript (ES6+)
- **Styling:** CSS3 with Grid & Flexbox
- **Data:** [PokéAPI](https://pokeapi.co/) for Pokemon data and images
- **Build:** npm
- **Deployment:** GitHub Actions + GitHub Pages

## 🎨 Customization

### Change Number of Cards
Edit `CONFIG.CARD_COUNT` and `CONFIG.PAIR_COUNT` in `game.js`:

```javascript
const CONFIG = {
    CARD_COUNT: 16,  // 4x4 grid
    PAIR_COUNT: 8,   // 8 pairs
    // ...
};
```

### Change Pokemon Source
Modify the `fetchRandomPokemon()` function to use different Pokemon generations or custom lists.

### Customize Styling
Edit `styles.css` to change colors, animations, or layout.

## ✅ Testing

See [TEST_CHECKLIST.md](TEST_CHECKLIST.md) for comprehensive test coverage including:
- Unit test results for all 6 implementation units
- Gameplay verification
- Browser compatibility
- API integration validation

## 🎯 Future Enhancements

- [ ] Keyboard navigation (arrow keys)
- [ ] Accessibility improvements (ARIA labels)
- [ ] Scoring and timer system
- [ ] Difficulty levels with 16+ cards
- [ ] Sound effects
- [ ] Local storage for high scores
- [ ] Multiplayer mode

## 📝 License

MIT

## 🤝 Contributing

Feel free to fork this project and submit pull requests with improvements!

## 📚 Resources

- [PokéAPI Documentation](https://pokeapi.co/)
- [MDN Web Docs - CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

Made with ❤️ for Pokemon fans
