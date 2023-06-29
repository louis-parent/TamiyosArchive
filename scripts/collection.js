import cardCollection from "./collection/CardCollection.js";

document.addEventListener("DOMContentLoaded", () => {
	cardCollection.cards.then(cards => cards.forEach(card => {
		const img = document.createElement("img");
		img.alt = card.oracle.name;
		img.src = card.faces[0];
		img.style.width = "15vw";
		img.style.minWidth = "256px";
		img.style.margin = "1vw";
		document.querySelector("#cards").appendChild(img);
	}));
});
