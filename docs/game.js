class PokemonMemoryGame {
    constructor() {
        this.gameBoard = document.getElementById('gameBoard');
        this.movesDisplay = document.getElementById('moves');
        this.matchesDisplay = document.getElementById('matches');
        this.timeDisplay = document.getElementById('time');
        this.restartBtn = document.getElementById('restartBtn');
        this.difficultyBtn = document.getElementById('difficultyBtn');
        this.winModal = document.getElementById('winModal');
        this.difficultyModal = document.getElementById('difficultyModal');
        this.resultText = document.getElementById('resultText');

        this.cards = [];
        this.flipped = [];
        this.matched = [];
        this.moves = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.isLocked = false;
        this.difficulty = localStorage.getItem('pokemonGameDifficulty') || 'easy';
        this.gridSize = { rows: 4, cols: 4 };
        this.bestScores = JSON.parse(localStorage.getItem('pokemonBestScores')) || {
            easy: null,
            medium: null,
            hard: null
        };
        this.currentCardIndex = -1;

        // Extended Pokemon data - expanded list for more variety
        this.pokemonList = [
            { id: 25, name: 'pikachu' },
            { id: 1, name: 'bulbasaur' },
            { id: 4, name: 'charmander' },
            { id: 7, name: 'squirtle' },
            { id: 6, name: 'charizard' },
            { id: 9, name: 'blastoise' },
            { id: 39, name: 'jigglypuff' },
            { id: 54, name: 'psyduck' },
            { id: 58, name: 'growlithe' },
            { id: 63, name: 'abra' },
            { id: 66, name: 'machop' },
            { id: 77, name: 'ponyta' },
            { id: 92, name: 'gastly' },
            { id: 95, name: 'onix' },
            { id: 104, name: 'cubone' },
            { id: 133, name: 'eevee' },
            { id: 143, name: 'snorlax' },
            { id: 147, name: 'dratini' },
            { id: 152, name: 'chikorita' },
            { id: 155, name: 'cyndaquil' },
            { id: 158, name: 'totodile' },
            { id: 172, name: 'pichu' },
            { id: 175, name: 'togepi' },
            { id: 183, name: 'azurill' },
            { id: 194, name: 'wooper' },
            { id: 258, name: 'mudkip' },
            { id: 261, name: 'poochyena' },
            { id: 335, name: 'zangoose' },
            { id: 371, name: 'bagon' },
            { id: 443, name: 'gible' },
            { id: 495, name: 'snivy' },
            { id: 498, name: 'tepig' },
            { id: 501, name: 'oshawott' },
            { id: 172, name: 'pichu' },
            { id: 133, name: 'eevee' },
        ];

        this.setupEventListeners();
        this.loadDifficultySettings();
        this.initializeGame();
    }

    setupEventListeners() {
        this.restartBtn.addEventListener('click', () => this.initializeGame());
        this.difficultyBtn.addEventListener('click', () => this.showDifficultyModal());
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.winModal.classList.add('hidden');
            this.initializeGame();
        });

        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.difficulty = btn.dataset.difficulty;
                localStorage.setItem('pokemonGameDifficulty', this.difficulty);
                const gridData = btn.dataset.grid.split('x');
                this.gridSize = { rows: parseInt(gridData[0]), cols: parseInt(gridData[1]) };
                this.difficultyModal.classList.add('hidden');
                this.initializeGame();
            });
        });

        // Keyboard support for accessibility
        document.addEventListener('keydown', (e) => {
            if (this.winModal.classList.contains('hidden') && 
                this.difficultyModal.classList.contains('hidden')) {
                // Number keys to flip cards
                if (e.key >= '1' && e.key <= '0') {
                    const index = e.key === '0' ? 9 : parseInt(e.key) - 1;
                    if (index < this.cards.length) {
                        this.flipCard(this.cards[index]);
                    }
                }
            }
        });
    }

    loadDifficultySettings() {
        const gridSizeMap = {
            easy: { rows: 4, cols: 4 },
            medium: { rows: 4, cols: 6 },
            hard: { rows: 6, cols: 6 }
        };
        this.gridSize = gridSizeMap[this.difficulty] || gridSizeMap.easy;
    }

    showDifficultyModal() {
        this.difficultyModal.classList.remove('hidden');
    }

    initializeGame() {
        this.cards = [];
        this.flipped = [];
        this.matched = [];
        this.moves = 0;
        this.isLocked = false;
        this.movesDisplay.textContent = '0';
        this.matchesDisplay.textContent = '0';

        // Update best score display
        this.updateBestScoreDisplay();

        // Clear timer
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.startTime = Date.now();
        this.timeDisplay.textContent = '0s';
        this.startTimer();

        // Set grid classes
        const totalCards = this.gridSize.rows * this.gridSize.cols;
        const pairCount = totalCards / 2;

        this.gameBoard.className = `game-board grid-${this.gridSize.rows}x${this.gridSize.cols}`;
        this.gameBoard.innerHTML = '';

        // Select random Pokemon for this game
        const selectedPokemon = this.pokemonList
            .sort(() => Math.random() - 0.5)
            .slice(0, pairCount);

        // Create pairs
        const pokemonPairs = [...selectedPokemon, ...selectedPokemon];
        pokemonPairs.sort(() => Math.random() - 0.5);

        // Create card elements
        pokemonPairs.forEach((pokemon, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.dataset.pokemon = pokemon.id;
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Card ${index + 1} - ${pokemon.name}`);

            const cardInner = document.createElement('div');
            cardInner.className = 'card-inner';

            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            cardFront.setAttribute('aria-hidden', 'true');

            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';

            const img = document.createElement('img');
            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
            img.alt = pokemon.name;
            img.onerror = () => {
                // Fallback image
                img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
            };

            cardBack.appendChild(img);
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);

            card.addEventListener('click', () => this.flipCard(card));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.flipCard(card);
                }
            });

            this.gameBoard.appendChild(card);
            this.cards.push(card);
        });

        this.winModal.classList.add('hidden');
    }

    updateBestScoreDisplay() {
        const bestScore = this.bestScores[this.difficulty];
        const bestScoreElement = document.getElementById('bestScore');
        
        if (bestScore) {
            bestScoreElement.textContent = `🏆 Best ${this.difficulty.toUpperCase()}: ${bestScore.moves} moves · ${bestScore.time}s`;
        } else {
            bestScoreElement.textContent = `Start your first ${this.difficulty} game!`;
        }
    }

    flipCard(card) {
        if (this.isLocked) return;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

        card.classList.add('flipped');
        this.flipped.push(card);

        if (this.flipped.length === 2) {
            this.isLocked = true;
            this.moves++;
            this.movesDisplay.textContent = this.moves;
            this.checkMatch();
        }
    }

    checkMatch() {
        const [card1, card2] = this.flipped;
        const match = card1.dataset.pokemon === card2.dataset.pokemon;

        if (match) {
            this.handleMatch(card1, card2);
        } else {
            this.handleMismatch(card1, card2);
        }
    }

    handleMatch(card1, card2) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.matched.push(card1, card2);
        this.matchesDisplay.textContent = this.matched.length / 2;

        this.flipped = [];
        this.isLocked = false;

        if (this.matched.length === this.cards.length) {
            this.endGame();
        }
    }

    handleMismatch(card1, card2) {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.classList.add('shake');
            card2.classList.add('shake');

            setTimeout(() => {
                card1.classList.remove('shake');
                card2.classList.remove('shake');
            }, 500);

            this.flipped = [];
            this.isLocked = false;
        }, 600);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this.timeDisplay.textContent = elapsed + 's';
        }, 100);
    }

    endGame() {
        clearInterval(this.timerInterval);
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Calculate score (lower moves and time is better)
        const score = this.moves + (elapsed / 10);
        
        // Check if this is a new best score
        let isBestScore = false;
        if (!this.bestScores[this.difficulty] || score < this.bestScores[this.difficulty].score) {
            this.bestScores[this.difficulty] = { moves: this.moves, time: elapsed, score };
            localStorage.setItem('pokemonBestScores', JSON.stringify(this.bestScores));
            isBestScore = true;
        }

        const bestInfo = this.bestScores[this.difficulty];
        const bestText = bestInfo ? `Best: ${bestInfo.moves} moves in ${bestInfo.time}s` : 'First game!';
        
        this.resultText.innerHTML = `
            <div style="margin: 10px 0;">Completed in ${this.moves} moves!</div>
            <div style="margin: 10px 0;">Time: ${elapsed} seconds</div>
            <div style="margin: 10px 0;">Difficulty: ${this.difficulty.toUpperCase()}</div>
            <div style="margin: 15px 0; font-size: 0.9em; color: #999;">${bestText}</div>
            ${isBestScore ? '<div style="color: #11998e; font-weight: bold; margin-top: 10px;">🏆 NEW BEST SCORE! 🏆</div>' : ''}
        `;

        setTimeout(() => {
            this.winModal.classList.remove('hidden');
        }, 600);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PokemonMemoryGame();
});
