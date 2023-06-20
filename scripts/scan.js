import cardCollection from "./CardCollection.js";

function withSelectedCard(operation) {
	const oracle = document.querySelector("#oracle").value;
	const set = document.querySelector("#set").value;
	const collectorNumber = document.querySelector("#collector-number").value;
	
	operation(oracle, set, collectorNumber);
}

document.addEventListener("DOMContentLoaded", () => {
	fetch("https://api.scryfall.com/sets").then(response => response.json()).then(sets => {
		const setSelector = document.querySelector("#set-selector");
		const setList = sets.data.filter(set => {
			return new Date(set.released_at) <= new Date();
		}).sort((a, b) => {
			return new Date(b.released_at) - new Date(a.released_at)
		});

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

		fetch(`https://api.scryfall.com/cards/${set}/${collectorNumber}/fr`).then(response => response.json()).then(data => {
			document.querySelector("#oracle").value = data.oracle_id;
			document.querySelector("#set").value = data.set;
			document.querySelector("#collector-number").value = data.collector_number;
			document.querySelector("#card").src = data.image_uris.normal;
			
			cardCollection.synchronized(() => {
				cardCollection.add(data.oracle_id, data.set, data.collector_number, false, 1);
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
