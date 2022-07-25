const cardsContainer = document.getElementById('cards-container'),
  prevBtn = document.getElementById('prev'),
  nextBtn = document.getElementById('next'),
  currentEl = document.getElementById('current'),
  showBtn = document.getElementById('show'),
  hideBtn = document.getElementById('hide'),
  questionEl = document.getElementById('question'),
  answerEl = document.getElementById('answer'),
  addCardBtn = document.getElementById('add-card'),
  clearBtn = document.getElementById('clear'),
  restoreBtn = document.getElementById('restore'),
  addContainer = document.getElementById('add-container');

// Keep track of current card
let currentActiveCard = 0;

// Store DOM cards
const cardsEl = [];

// Store card data
const cardsData = getCardsData();

// const cardsData = [
//   {
//     question: 'What must a variable begin with?',
//     answer: 'A letter, $ or _'
//   },
//   {
//     question: 'What is a variable?',
//     answer: 'Container for a piece of data'
//   },
//   {
//     question: 'Example of Case Sensitive Variable',
//     answer: 'thisIsAVariable'
//   }
// ];

// Create all cards
function createCards() {
  cardsData.forEach((data, index) => createCard(data, index));
}

// Create a single card in DOM
function createCard(data, index) {
  const card = document.createElement('div');
  card.classList.add('card');

  if (index === 0) {
    card.classList.add('active');
  }

  card.innerHTML = `
  <div class="inner-card">
  <div class="inner-card-front">
    <p>
      ${data.question}
    </p>
  </div>
  <div class="inner-card-back">
    <p>
      ${data.answer}
    </p>
  </div>
</div>
  `;

  card.addEventListener('click', () => card.classList.toggle('show-answer'));

  // Add to DOM cards
  cardsEl.push(card);

  cardsContainer.appendChild(card);

  updateCurrentCardNumber();
}

// Show number of cards
function updateCurrentCardNumber() {
  currentEl.innerText = `${currentActiveCard + 1}/${cardsEl.length}`;
}

// Get cards from local storage
function getCardsData() {
  const cardsLS = JSON.parse(localStorage.getItem('cards'));
  return cardsLS === null ? [] : cardsLS;
}

// Add card to local storage
function setCardsData(cardsLS) {
  localStorage.setItem('cards', JSON.stringify(cardsLS));
  sessionStorage.clear();
  window.location.reload();
}

createCards();

// Event listeners
// Next button
nextBtn.addEventListener('click', () => {
  cardsEl[currentActiveCard].className = 'card left';

  currentActiveCard = currentActiveCard + 1;

  if (currentActiveCard > cardsEl.length - 1) {
    currentActiveCard = cardsEl.length - 1;
  }

  cardsEl[currentActiveCard].className = 'card active';

  updateCurrentCardNumber();
});

// Prev button
prevBtn.addEventListener('click', () => {
  cardsEl[currentActiveCard].className = 'card right';

  currentActiveCard = currentActiveCard - 1;

  if (currentActiveCard < 0) {
    currentActiveCard = 0;
  }

  cardsEl[currentActiveCard].className = 'card active';

  updateCurrentCardNumber();
});

// Show add container
showBtn.addEventListener('click', () => addContainer.classList.add('show'));
// Hide add container
hideBtn.addEventListener('click', () => addContainer.classList.remove('show'));

// Add new card
addCardBtn.addEventListener('click', () => {
  const question = questionEl.value;
  const answer = answerEl.value;

  if (question.trim() && answer.trim()) {
    const newCard = { question, answer };

    createCard(newCard);

    questionEl.value = '';
    answerEl.value = '';

    addContainer.classList.remove('show');

    cardsData.push(newCard);
    setCardsData(cardsData);
  }
  clearBtn.classList.add('show');
});

// Clear All Cards button, clears the display,
//if any cards in local storage, moves them to session storage
clearBtn.addEventListener('click', () => {
  const cards = localStorage.getItem('cards');

  if (cards) {
    localStorage.clear();

    sessionStorage.setItem('tempCards', cards);
    window.location.reload();
  }
});

/*Clicking Restore restores from session storage. If session storage is empty, it does nothing
 */
restoreBtn.addEventListener('click', () => {
  const tempCards = sessionStorage.getItem('tempCards');

  if (tempCards) {
    localStorage.clear();

    sessionStorage.clear();

    localStorage.setItem('cards', tempCards);

    //create the card set with 1st card displayed
    createCards();

    //reload the page, resets #/#
    //bug with the #/# showing the 2nd number doubled
    //fixed by putting operations in correct order
    //reload the page AFTER creating cards
    window.location.reload();
  }
});

//Delete card functionality, future
/*button to delete the currently displayed item
 * delete it from screen
 * delete it from local storage (no restore)
 *
 */

/*
2nd new function, displayRestoreBtn() which checks if anything in session storage and if anything there, display Restore
*/
