// ==========================================
// POKEMON MEMORY GAME
// ==========================================

// Configuration
const CONFIG = {
    CARD_COUNT: 12,
    PAIR_COUNT: 6,
    FLIP_DELAY: 1000, // 1 second before unflipping non-matches
    POKEMON_API: 'https://pokeapi.co/api/v2/pokemon/',
    FALLBACK_POKEMON: [
        { name: 'Pikachu', id: 25 },
        { name: 'Charizard', id: 6 },
        { name: 'Blastoise', id: 9 },
        { name: 'Venusaur', id: 3 },
        { name: 'Dragonite', id: 149 },
        { name: 'Gengar', id: 94 }
    ]
};

// Game State
let GameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    gameOver: false,
    isLocked: false,
    pendingTimeout: null
};

// ==========================================
// UNIT 1: INITIALIZATION
// ==========================================

/**
 * Initialize the game on page load
 */
async function initGame() {
    console.log('Initializing game...');
    resetGameState();
    await setupGame();
}

/**
 * Reset game state to initial values
 */
function resetGameState() {
    GameState = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        gameOver: false,
        isLocked: false,
        pendingTimeout: null
    };
}

/**
 * Setup the game: fetch Pokemon and render board
 */
async function setupGame() {
    showLoadingSpinner(true);
    
    try {
        const pokemon = await fetchRandomPokemon(CONFIG.PAIR_COUNT);
        const cards = createCardPairs(pokemon);
        GameState.cards = shuffleCards(cards);
        renderBoard();
        hideWinMessage();
    } catch (error) {
        console.error('Error setting up game:', error);
        showLoadingSpinner(false);
    }
}

// ==========================================
// UNIT 2: FETCH POKEMON FROM API
// ==========================================

/**
 * Fetch random Pokemon from PokéAPI
 * @param {number} count - Number of unique Pokemon to fetch
 * @returns {Promise<Array>} Array of Pokemon objects with name, id, and imageUrl
 */
async function fetchRandomPokemon(count) {
    try {
        const pokemonList = [];
        const usedIds = new Set();

        while (pokemonList.length < count) {
            const randomId = Math.floor(Math.random() * 905) + 1; // Pokemon IDs 1-905
            
            if (usedIds.has(randomId)) continue;
            usedIds.add(randomId);

            const response = await fetch(`${CONFIG.POKEMON_API}${randomId}`);
            if (!response.ok) throw new Error(`Failed to fetch Pokemon ${randomId}`);
            
            const data = await response.json();
            
            pokemonList.push({
                name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
                id: data.id,
                imageUrl: data.sprites.other['official-artwork'].front_default || 
                          data.sprites.front_default || ''
            });
        }

        console.log('Fetched Pokemon:', pokemonList);
        return pokemonList;
    } catch (error) {
        console.error('Error fetching Pokemon:', error);
        console.log('Using fallback Pokemon...');
        return CONFIG.FALLBACK_POKEMON.slice(0, count);
    }
}

/**
 * Create card pairs from Pokemon list
 * @param {Array} pokemon - Array of Pokemon objects
 * @returns {Array} Array of card objects with unique IDs and Pokemon references
 */
function createCardPairs(pokemon) {
    const cards = [];
    let cardId = 1;

    pokemon.forEach(poke => {
        // Create two cards for each Pokemon
        cards.push({
            id: cardId++,
            pokemonId: poke.id,
            pokemonName: poke.name,
            imageUrl: poke.imageUrl,
            isFlipped: false,
            isMatched: false,
            isLocked: false
        });

        cards.push({
            id: cardId++,
            pokemonId: poke.id,
            pokemonName: poke.name,
            imageUrl: poke.imageUrl,
            isFlipped: false,
            isMatched: false,
            isLocked: false
        });
    });

    return cards;
}

/**
 * Shuffle cards using Fisher-Yates algorithm
 * @param {Array} cards - Array of card objects
 * @returns {Array} Shuffled array of cards
 */
function shuffleCards(cards) {
    const shuffled = [...cards];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

// ==========================================
// UNIT 3: CARD FLIPPING LOGIC
// ==========================================

/**
 * Render the game board with cards
 */
function renderBoard() {
    const boardElement = document.getElementById('gameBoard');
    boardElement.innerHTML = '';

    GameState.cards.forEach(card => {
        const cardElement = createCardElement(card);
        boardElement.appendChild(cardElement);
    });

    showLoadingSpinner(false);
}

/**
 * Create a single card DOM element
 * @param {Object} card - Card object
 * @returns {HTMLElement} Card element
 */
function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.dataset.cardId = card.id;

    // Card back (default)
    // Card front (hidden until flipped)
    const imageContainer = document.createElement('div');
    imageContainer.className = 'card__image';

    if (card.imageUrl) {
        const img = document.createElement('img');
        img.src = card.imageUrl;
        img.alt = card.pokemonName;
        imageContainer.appendChild(img);
    }

    const nameDiv = document.createElement('div');
    nameDiv.className = 'card__name';
    nameDiv.textContent = card.pokemonName;
    imageContainer.appendChild(nameDiv);

    cardDiv.appendChild(imageContainer);

    // Apply initial state classes
    if (card.isFlipped) cardDiv.classList.add('card--flipped');
    if (card.isMatched) cardDiv.classList.add('card--matched');

    // Add click event listener
    cardDiv.addEventListener('click', () => handleCardClick(card, cardDiv));

    return cardDiv;
}

/**
 * Handle card click event
 * @param {Object} card - Card object
 * @param {HTMLElement} cardElement - Card DOM element
 */
function handleCardClick(card, cardElement) {
    // Ignore if card is already matched, flipped, locked, or game is over
    if (card.isMatched || card.isFlipped || GameState.isLocked || GameState.gameOver) {
        return;
    }

    // Flip the card
    flipCard(card, cardElement);
    GameState.flippedCards.push({ card, cardElement });

    // Check if two cards are flipped
    if (GameState.flippedCards.length === 2) {
        GameState.isLocked = true;
        checkMatch();
    }
}

/**
 * Flip a card with animation
 * @param {Object} card - Card object
 * @param {HTMLElement} cardElement - Card DOM element
 */
function flipCard(card, cardElement) {
    card.isFlipped = true;
    cardElement.classList.add('card--flipped');
}

/**
 * Unflip a card
 * @param {Object} card - Card object
 * @param {HTMLElement} cardElement - Card DOM element
 */
function unflipCard(card, cardElement) {
    card.isFlipped = false;
    cardElement.classList.remove('card--flipped');
}

// ==========================================
// UNIT 4: MATCH DETECTION
// ==========================================

/**
 * Check if the two flipped cards match
 */
function checkMatch() {
    const [first, second] = GameState.flippedCards;
    const isMatch = first.card.pokemonId === second.card.pokemonId;

    if (isMatch) {
        handleMatch(first, second);
    } else {
        handleMismatch(first, second);
    }
}

/**
 * Handle matched cards
 * @param {Object} first - First card flip object
 * @param {Object} second - Second card flip object
 */
function handleMatch(first, second) {
    console.log('Match found!');
    
    first.card.isMatched = true;
    second.card.isMatched = true;
    
    first.cardElement.classList.add('card--matched');
    second.cardElement.classList.add('card--matched');
    
    GameState.matchedPairs++;

    // Clear flipped cards
    GameState.flippedCards = [];
    GameState.isLocked = false;

    // Check if game is won
    if (GameState.matchedPairs === CONFIG.PAIR_COUNT) {
        handleWin();
    }
}

/**
 * Handle mismatched cards - unflip after delay
 * @param {Object} first - First card flip object
 * @param {Object} second - Second card flip object
 */
function handleMismatch(first, second) {
    console.log('No match');
    
    // Clear previous timeout if any
    if (GameState.pendingTimeout) {
        clearTimeout(GameState.pendingTimeout);
    }

    // Unflip after delay
    GameState.pendingTimeout = setTimeout(() => {
        unflipCard(first.card, first.cardElement);
        unflipCard(second.card, second.cardElement);
        
        GameState.flippedCards = [];
        GameState.isLocked = false;
        GameState.pendingTimeout = null;
    }, CONFIG.FLIP_DELAY);
}

// ==========================================
// UNIT 5: WIN CONDITION & RESTART
// ==========================================

/**
 * Handle game win
 */
function handleWin() {
    console.log('You won!');
    GameState.gameOver = true;
    showWinMessage();
}

/**
 * Show the win message overlay
 */
function showWinMessage() {
    const winMessage = document.getElementById('winMessage');
    winMessage.classList.add('win-message--visible');
}

/**
 * Hide the win message overlay
 */
function hideWinMessage() {
    const winMessage = document.getElementById('winMessage');
    winMessage.classList.remove('win-message--visible');
}

/**
 * Show or hide loading spinner
 * @param {boolean} show - Whether to show the spinner
 */
function showLoadingSpinner(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.add('loading--visible');
    } else {
        spinner.classList.remove('loading--visible');
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================

document.addEventListener('DOMContentLoaded', initGame);

document.getElementById('restartBtn').addEventListener('click', () => {
    console.log('Restart button clicked');
    setupGame();
});

document.getElementById('winRestartBtn').addEventListener('click', () => {
    console.log('Win restart button clicked');
    setupGame();
});

// ==========================================
// EXPORTS FOR TESTING (if needed)
// ==========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchRandomPokemon,
        createCardPairs,
        shuffleCards,
        checkMatch,
        GameState
    };
}
