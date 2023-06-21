import cardCollection from "./CardCollection.js";

document.addEventListener("DOMContentLoaded", () => {
	cardCollection.cards.then(cards => cards.forEach(card => {
		const img = document.createElement("img");
		img.alt = card.oracle.name;
		img.src = card.faces[0];
		document.querySelector("#cards").appendChild(img);
	}));
});
