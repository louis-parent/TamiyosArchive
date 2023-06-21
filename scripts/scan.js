import Scryfall from "./scryfall/Scryfall.js";
import cardCollection from "./CardCollection.js";

function withSelectedCard(operation) {
	const oracle = document.querySelector("#oracle").value;
	const set = document.querySelector("#set").value;
	const collectorNumber = document.querySelector("#collector-number").value;
	
	operation(oracle, set, collectorNumber);
}

document.addEventListener("DOMContentLoaded", () => {
	Scryfall.sets.then(sets => {
		const setSelector = document.querySelector("#set-selector");
		const now = new Date();
		
		const setList = sets.filter(set => {
			return set.releasedAt <= now;
		}).sort((a, b) => {
			return b.releasedAt - a.releasedAt;
		});

		setSelector.innerHTML = "";

		for(const set of setList) {
			const option = document.createElement("option");
			option.value = set.code;
			option.innerText = `${set.code.toUpperCase()} - ${set.name}`;
			setSelector.appendChild(option);
		}
	});
	
	document.querySelector("#collector-input").addEventListener("keyup", (event) => {
		event.preventDefault();
		if(event.keyCode === 13) {
			document.querySelector("#add").click();
		}
	});

	document.querySelector("#add").addEventListener("click", () => {
		const collectorInput = document.querySelector("#collector-input");
		const collectorNumber = collectorInput.value;
		const set = document.querySelector("#set-selector").value;
		
		Scryfall.getCardByCollectorNumber(set, collectorNumber).then(card => {
			document.querySelector("#oracle").value = card.oracle.id;
			document.querySelector("#set").value = set;
			document.querySelector("#collector-number").value = collectorNumber;
			document.querySelector("#card").src = card.faces[0];
			
			cardCollection.synchronized(() => {
				cardCollection.add(card.oracle.id, set, collectorNumber, false, 1);
			});
			
			collectorInput.focus();
	  		collectorInput.select();
		});
	});

	document.querySelector("#to-foil").addEventListener("click", () => {
		withSelectedCard((oracle, set, collectorNumber) => {
			cardCollection.synchronized(() => {
				cardCollection.remove(oracle, set, collectorNumber, false, 1);
				cardCollection.add(oracle, set, collectorNumber, true, 1);
			});
		});
	});

	document.querySelector("#add-more").addEventListener("click", () => {
		withSelectedCard((oracle, set, collectorNumber) => {
			cardCollection.synchronized(() => {
				cardCollection.add(oracle, set, collectorNumber, false, 1);
			});
		});
	});

	document.querySelector("#add-more-foil").addEventListener("click", () => {
		withSelectedCard((oracle, set, collectorNumber) => {
			cardCollection.synchronized(() => {
				cardCollection.add(oracle, set, collectorNumber, true, 1);
			});
		});
	});

	document.querySelector("#remove").addEventListener("click", () => {
		withSelectedCard((oracle, set, collectorNumber) => {
			cardCollection.synchronized(() => {
				cardCollection.remove(oracle, set, collectorNumber, false, 1);
			});
		});
	});

	document.querySelector("#remove-foil").addEventListener("click", () => {
		withSelectedCard((oracle, set, collectorNumber) => {
			cardCollection.synchronized(() => {
				cardCollection.remove(oracle, set, collectorNumber, true, 1);
			});
		});
	});
});
