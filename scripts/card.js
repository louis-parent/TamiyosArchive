import Scryfall from "./scryfall/Scryfall.js";

const SEARCH_PARAMS = (new URL(document.location)).searchParams;

if(!(SEARCH_PARAMS.has("set") && SEARCH_PARAMS.has("collector_number"))) {
	window.location = "index.html";
}
else {
	const SET = SEARCH_PARAMS.get("set");
	const COLLECTOR_NUMBER = SEARCH_PARAMS.get("collector_number");
	const LANG = SEARCH_PARAMS.get("lang");

	document.addEventListener("DOMContentLoaded", async () => {
		Scryfall.getCardByCollectorNumber(SET, COLLECTOR_NUMBER, LANG).then((card) => {
			console.log(card);
			document.querySelector("#illustration").src = card.faces[0];
			
			document.querySelector("#name").innerText = card.localization.name;
			
			document.querySelector("#mana-cost").innerText = card.oracle.manaCost;
			
			document.querySelector("#type").innerText = card.localization.type;
			document.querySelector("#text").innerText = card.localization.text;
			
			document.querySelector("#collector-number").innerText = card.collectorNumber;
			document.querySelector("#rarity").innerText = card.rarity;
			
			card.set.then(set => {
				document.querySelector("#set-icon").src = set.icon;
				document.querySelector("#set-name").innerText = set.name;
				document.querySelector("#set-code").innerText = set.code;
			});
			
			Scryfall.symbols.then(symbols => {		
				for(const symbol of symbols) {
					document.querySelector("#mana-cost").innerHTML = document.querySelector("#mana-cost").innerHTML.replaceAll(symbol.string, `<img src="${symbol.image}" style="height: 1em;" />`)
					document.querySelector("#text").innerHTML = document.querySelector("#text").innerHTML.replaceAll(symbol.string, `<img src="${symbol.image}" style="height: 1em;" />`)
				}
			});
		});
	});
}

