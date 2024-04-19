import { getNItems } from './itemFetcher.js';
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.1/+esm'

const Items = [
  {
    name: "Item 1",
    value: 0.75,
    patternIndex: 123,
    description: "Description for Item 1",
    image: "item1.jpg",
    stickers: [
      { name: "Sticker A", image: "stickerA.jpg", value: 0.5 },
      { name: "Sticker B", image: "stickerB.jpg", value: 0.8 },
    ],
  },
  {
    name: "Item 2",
    value: 0.6,
    patternIndex: 456,
    description: "Description for Item 2",
    image: "item2.jpg",
    stickers: [],
  },
  // Add more items here
];

// Function to generate HTML for a single item card
function generateItemCard(item) {
  const stickersHtml = item.stickers
    .map(
      (sticker) =>
        `<div class="sticker">
           <img src="${sticker.image}" alt="${sticker.name}" />
           <p>${sticker.name}</p>
         </div>`
    )
    .join("");

  return `
    <div class="card">
      <img src="${item.image}" alt="${item.name}" />
      <h2>${item.name}</h2>
      <p>Value: ${item.value}</p>
      <p>Pattern Index: ${item.patternIndex}</p>
      <p>${item.description}</p>
      <div class="stickers">
        ${stickersHtml}
      </div>
    </div>
  `;
}

// Function to generate HTML for item rows
function generateItemRows(items) {
  let rowsHtml = "";
  for (let i = 0; i < items.length; i += 4) {
    const rowItems = items.slice(i, i + 4);
    const cardsHtml = rowItems.map((item) => generateItemCard(item)).join("");
    rowsHtml += `<div class="row">${cardsHtml}</div>`;
  }
  return rowsHtml;
}

// Generate the HTML for the item rows and append it to the document
const response = await getNItems(window.steamIdVar, 100);
console.log(response);
const itemRowsHtml = generateItemRows(Items);
document.getElementById("itemContainer").innerHTML = response;
