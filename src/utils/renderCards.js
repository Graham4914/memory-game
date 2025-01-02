import { shuffle } from "lodash";
// or write your own Fisher-Yates shuffle if you prefer

export function renderCards(fullDeck, selectedCards, count = 8) {
  console.log("RenderCards input:", { fullDeck, selectedCards });

  const unselected = fullDeck.filter(
    (card) => !selectedCards.includes(card.code)
  );

  if (unselected.length === 0) {
    console.log("All cards have been selected or fullDeck is empty.");
    return []; // Return an empty array if no cards can be selected
  }

  const randomUnselected = unselected[Math.floor(Math.random() * unselected.length)];
  const restPool = fullDeck.filter((c) => c.code !== randomUnselected.code);
  const randomRest = shuffle(restPool).slice(0, count - 1);

  const combined = shuffle([randomUnselected, ...randomRest]);
  console.log("Rendered cards:", combined);

  return combined;
}