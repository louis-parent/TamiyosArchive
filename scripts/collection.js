import cardCollection from "./collection/CardCollection.js";

document.addEventListener("DOMContentLoaded", () => {
	cardCollection.items.forEach(item => {
		const container = document.createElement("div");
		container.style.position = "relative";
		container.style.width = "15vw";
		container.style.minWidth = "256px";
		container.style.margin = "1vw";
		container.style.display = "inline-block";
		
		const img = document.createElement("img");
		item.newestCard.then(card => {
			img.alt = card.oracle.name;
			img.src = card.faces[0];
		});
		img.style.width = "100%";
		container.appendChild(img);
		
		const pill = document.createElement("span");
		pill.innerHTML = item.nonFoilCount + " / " + item.foilCount + "<small>✨</small>";
		pill.style.display = "block";
		pill.style.position = "absolute";
		pill.style.left = "50%";
		pill.style.bottom = "5%";
		pill.style.backgroundColor = "var(--primary-color)";
		pill.style.color = "var(--on-primary-color)";
		pill.style.borderRadius = "1em";
		pill.style.padding = "0.25em 0.5em";
		pill.style.transform = "translateX(-50%)";
		container.appendChild(pill);
		
		document.querySelector("#cards").appendChild(container);
	});
});
