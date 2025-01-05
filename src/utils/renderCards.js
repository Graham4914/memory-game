import { shuffle } from "lodash";

export function renderCards(fullDeck, selectedCards, count = 8) {
  

  if (fullDeck.length === 0) {
    console.error("RenderCards called with and empty dullDeck")
    return [];
  }

  const unselected = fullDeck.filter(
    (card) => !selectedCards.includes(card.code)
  );

  if (unselected.length === 0) {
    // No unselected cards left, return any random 8 cards
    return shuffle(fullDeck).slice(0, count);
  }

  const randomUnselected = unselected[Math.floor(Math.random() * unselected.length)];
  const restPool = fullDeck.filter((c) => c.code !== randomUnselected.code);
  const randomRest = shuffle(restPool).slice(0, count - 1);

  const combined = shuffle([randomUnselected, ...randomRest]);
  

  return combined;
}