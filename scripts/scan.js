fetch("https://api.scryfall.com/sets").then(response => response.json()).then(sets => {
	const setSelector = document.querySelector("#set");
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

document.querySelector("#add").addEventListener("click", () => {
	const collectorInput = document.querySelector("#collector");
	const collectorNumber = collectorInput.value;
	const set = document.querySelector("#set").value;

	fetch(`https://api.scryfall.com/cards/${set}/${collectorNumber}/fr`).then(response => response.json()).then(data => {
		document.querySelector("#card").src = data.image_uris.normal;
		collectorInput.focus();
  		collectorInput.select();
	});
});

document.querySelector("#collector").addEventListener("keyup", (event) => {
	event.preventDefault();
	if(event.keyCode === 13) {
		document.querySelector("#add").click();
	}
});
