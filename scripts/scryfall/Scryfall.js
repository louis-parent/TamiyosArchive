import Set from "./Set.js"
import Card from "./Card.js";

class Scryfall
{	
	static get sets() {
		return Set.all;
	}
	
	static get symbols() {
		return fetch("https://api.scryfall.com/symbology").then(response => response.json()).then(symbols => {
			return symbols.data.map(symbol => {
				return {
					string: symbol.symbol,
					image: symbol.svg_uri,
					text: symbol.english
				};
			});
		});
	}
	
	static getCardByCollectorNumber(set, collectorNumber, language) {
		return Card.forCollectorNumber(set, collectorNumber, language);
	}
	
	static getCardsByConstraint(constraints) {
		return Card.forConstraints(constraints);
	}
}

export default Scryfall;
