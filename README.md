# 🎮 Pokemon Memory Game

A fun, interactive memory matching game featuring Pokemon characters. Match pairs of Pokemon cards to win! Built with vanilla HTML, CSS, and JavaScript.

## 🎯 Features

- **Three Difficulty Levels**: Easy (4×4), Medium (4×6), Hard (6×6)
- **Score Tracking**: Automatic best score tracking per difficulty using localStorage
- **35+ Pokemon**: Variety of Pokemon from different generations
- **Smooth Animations**: Flip animations, match confirmations, and shake effects
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: Keyboard navigation support and ARIA labels

## 🕹️ How to Play

1. Click (or tap) on cards to flip them and reveal the Pokemon
2. Find matching pairs by flipping two cards
3. When you match a pair, the cards lock in place with a checkmark (✓)
4. Complete all pairs to win the game
5. Your best scores are automatically saved per difficulty level

## 🚀 Deployment

This game is automatically deployed to GitHub Pages using GitHub Actions.

### GitHub Pages Configuration

The deployment workflow (`.github/workflows/deploy.yml`) automatically:

- Triggers on every push to the `main` branch
- Uploads the entire repository as a static site
- Deploys to GitHub Pages

### Access Your Game

Once deployed, your game will be available at:

```text
https://<username>.github.io/<repository>/
```

For example: `https://ethanjenkins1.github.io/devdaysweb/`

### Enable GitHub Pages

1. Go to your repository settings: **Settings > Pages**
2. Under "Build and deployment":
   - Source: Select **GitHub Actions**
   - This is already configured in `.github/workflows/deploy.yml`
3. Save and wait ~1 minute for the first deployment

## 📋 Project Structure

```
devdaysweb/
├── index.html           # Game HTML structure
├── styles.css           # Game styling and animations
├── game.js              # Game logic and mechanics
├── README.md            # This file
├── .gitignore           # Git ignore patterns
└── .github/
    └── workflows/
        └── deploy.yml   # GitHub Actions deployment workflow
```

## 🎨 Game Statistics

The game tracks:
- **Moves**: Number of card flips
- **Matches**: Number of successful pairs
- **Time**: Elapsed time in seconds
- **Best Score**: Automatically saved for each difficulty level

## 🛠️ Local Development

Simply clone the repository and open `index.html` in your browser:

```bash
git clone <repository-url>
cd devdaysweb
# Open index.html in your browser
```

No build tools or dependencies required!

## 🎨 Customization

### Add More Pokemon
Edit `game.js` and add more entries to the `pokemonList` array:

```javascript
{ id: <pokedex_id>, name: '<pokemon_name>' }
```

Pokemon official artwork images are pulled from:
`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/<id>.png`

### Change Colors
Edit the CSS gradient colors in `styles.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 📱 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## 🎮 Game Controls

- **Mouse**: Click cards to flip
- **Touch**: Tap cards on mobile devices
- **Keyboard**: Coming soon (currently spacebar/enter on focused cards)

## 📊 Deployment Workflow

The GitHub Actions workflow does the following:

1. **Checkout**: Retrieves your code
2. **Setup Pages**: Configures GitHub Pages environment
3. **Upload Artifact**: Uploads all files to GitHub Pages
4. **Deploy**: Publishes to your live URL

Each commit to `main` triggers automatic deployment!

## 🐛 Troubleshooting

**Game not loading?**
- Check browser console for errors (F12)
- Ensure you're accessing the correct GitHub Pages URL

**Images not showing?**
- Check your internet connection (images are fetched from GitHub)
- The fallback sprite will load if official artwork is unavailable

**Best score not saving?**
- Check if localStorage is enabled in your browser
- Clear browser cache and reload

## 📄 License

Feel free to use and modify this project as needed!

## 🎉 Enjoy!

Have fun playing and matching Pokemon! 🎮✨
