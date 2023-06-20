class CardCollection {
	static STORAGE_NAME = "collection";
	
	constructor(cards) {
		this.cards = new Object();
		
		for(const oracle of Object.keys(cards || {})) {
			console.log(oracle, "in", Object.keys(cards || {}));
			for(const set of Object.keys(cards[oracle] || {})) {
				console.log(set, "in", Object.keys(cards[oracle] || {}));
				for(const collectorNumber of Object.keys(cards[oracle][set] || {})) {
					console.log(collectorNumber, "in", Object.keys(cards[oracle][set] || {}));
					this.add(oracle, set, collectorNumber, true, cards[oracle][set][collectorNumber].foil || 0);
					this.add(oracle, set, collectorNumber, false, cards[oracle][set][collectorNumber].nonFoil || 0);
				}
			}
		}
	}
	
	add(oracle, set, collectorNumber, isFoil, number) {
		if(this.cards[oracle] === undefined) {
			this.cards[oracle] = new Object();
		}
		
		if(this.cards[oracle][set] === undefined) {
			this.cards[oracle][set] = new Object();
		}
		
		if(this.cards[oracle][set][collectorNumber] === undefined) {
			this.cards[oracle][set][collectorNumber] = {
				foil: 0,
				nonFoil: 0
			};
		}
		
		this.cards[oracle][set][collectorNumber][isFoil ? "foil" : "nonFoil"] += (number || 1);
	}
	
	remove(oracle, set, collectorNumber, isFoil, number) {
		if(this.cards[oracle] !== undefined) {
			if(this.cards[oracle][set] !== undefined) {
				if(this.cards[oracle][set][collectorNumber] !== undefined) {
					this.cards[oracle][set][collectorNumber][isFoil ? "foil" : "nonFoil"] -= (number || 1);
					
					if(this.cards[oracle][set][collectorNumber][isFoil ? "foil" : "nonFoil"] < 0) {
						this.cards[oracle][set][collectorNumber][isFoil ? "foil" : "nonFoil"] = 0;
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
		localStorage.setItem(CardCollection.STORAGE_NAME, JSON.stringify(this.cards));
	}
	
	static loadFromStorage() {
		return new CardCollection(JSON.parse(localStorage.getItem(CardCollection.STORAGE_NAME)));
	}
	
	static clearFromStorage() {
		localStorage.removeItem(CardCollection.STORAGE_NAME);
	}
}

export default CardCollection.loadFromStorage();
