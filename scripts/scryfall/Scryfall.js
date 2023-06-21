import Set from "./Set.js"
import Card from "./Card.js";

class Scryfall
{
	static get sets() {
		return fetch("https://api.scryfall.com/sets").then(response => response.json()).then(sets => {
			return sets.data.map(set => new Set(set.code.toUpperCase(), set.name, new Date(set.released_at), set.icon_svg_uri));
		});
	}
	
	static getCardByCollectorNumber(set, collectorNumber) {
		return Card.forCollectorNumber(set, collectorNumber);
	}
}

export default Scryfall;
