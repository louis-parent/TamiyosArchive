import Scryfall from "./scryfall/Scryfall.js";

class CardCollection {
	static STORAGE_NAME = "collection";
	
	constructor(cards) {
		this.collection = new Object();
		
		for(const oracle of Object.keys(cards || {})) {
			for(const set of Object.keys(cards[oracle] || {})) {
				for(const collectorNumber of Object.keys(cards[oracle][set] || {})) {
					this.add(oracle, set, collectorNumber, true, cards[oracle][set][collectorNumber].foil || 0);
					this.add(oracle, set, collectorNumber, false, cards[oracle][set][collectorNumber].nonFoil || 0);
				}
			}
		}
	}
	
	add(oracle, set, collectorNumber, isFoil, number) {
		if(this.collection[oracle] === undefined) {
			this.collection[oracle] = new Object();
		}
		
		if(this.collection[oracle][set] === undefined) {
			this.collection[oracle][set] = new Object();
		}
		
		if(this.collection[oracle][set][collectorNumber] === undefined) {
			this.collection[oracle][set][collectorNumber] = {
				foil: 0,
				nonFoil: 0
			};
		}
		
		this.collection[oracle][set][collectorNumber][isFoil ? "foil" : "nonFoil"] += (number || 1);
	}
	
	remove(oracle, set, collectorNumber, isFoil, number) {
		if(this.collection[oracle] !== undefined) {
			if(this.collection[oracle][set] !== undefined) {
				if(this.collection[oracle][set][collectorNumber] !== undefined) {
					this.collection[oracle][set][collectorNumber][isFoil ? "foil" : "nonFoil"] -= (number || 1);
					
					if(this.collection[oracle][set][collectorNumber][isFoil ? "foil" : "nonFoil"] < 0) {
						this.collection[oracle][set][collectorNumber][isFoil ? "foil" : "nonFoil"] = 0;
					}
				}
			}
		}
	}
	
	synchronized(callback) {
		callback(this);
		this.saveToStorage();
	}
	
	saveToStorage() {
		localStorage.setItem(CardCollection.STORAGE_NAME, JSON.stringify(this.collection));
	}
	
	get cards() {
		const cards = new Array();
		
		for(const oracle of Object.keys(this.collection)) {
			const set = Object.keys(this.collection[oracle])[0];
			const collectorNumber = Object.keys(this.collection[oracle][Object.keys(this.collection[oracle])[0]])[0];
			
			cards.push(Scryfall.getCardByCollectorNumber(set, collectorNumber));
		}
		
		return Promise.all(cards);
	}
	
	static loadFromStorage() {
		return new CardCollection(JSON.parse(localStorage.getItem(CardCollection.STORAGE_NAME)));
	}
	
	static clearFromStorage() {
		localStorage.removeItem(CardCollection.STORAGE_NAME);
	}
}

export default CardCollection.loadFromStorage();
