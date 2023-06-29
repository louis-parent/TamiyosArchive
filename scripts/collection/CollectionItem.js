import Scryfall from "../scryfall/Scryfall.js";

class CollectionItem {
	constructor(oracle, owned) {
		this.oracle = oracle;
		this.owned = new Object();
		
		for(const set in owned) {
			for(const collectorNumber in owned[set]) {
				for(const language in owned[set][collectorNumber]) {
					this.add(set, collectorNumber, language, true, owned[set][collectorNumber][language].foil);
					this.add(set, collectorNumber, language, false, owned[set][collectorNumber][language].nonFoil);
				}
			}
		}
	}
	
	add(set, collectorNumber, language, isFoil, amount) {
		if(this.owned[set] === undefined) {
			this.owned[set] = new Object();
		}
		
		if(this.owned[set][collectorNumber] === undefined) {
			this.owned[set][collectorNumber] = new Object();
		}
		
		if(this.owned[set][collectorNumber][language] === undefined) {
			this.owned[set][collectorNumber][language] = {
				foil: 0,
				nonFoil: 0
			};
		}
		
		this.owned[set][collectorNumber][language][isFoil ? "foil" : "nonFoil"] += (amount !== undefined ? amount : 1);
	}
	
	remove(set, collectorNumber, language, isFoil, amount) {
		if(this.owned[set] !== undefined) {
			if(this.owned[set][collectorNumber] !== undefined) {
				if(this.owned[set][collectorNumber][language] !== undefined) {
					this.owned[set][collectorNumber][language][isFoil ? "foil" : "nonFoil"] -= (amount !== undefined ? amount : 1);
					
					if(this.owned[set][collectorNumber][language][isFoil ? "foil" : "nonFoil"] < 0) {
						this.owned[set][collectorNumber][language][isFoil ? "foil" : "nonFoil"] = 0;
					}
				}
			}
		}
	}
	
	get newestCard() {
		const set = Object.keys(this.owned)[0];
		const collectorNumber = Object.keys(this.owned[set])[0];
		const language = Object.keys(this.owned[set][collectorNumber])[0];

		return Scryfall.getCardByCollectorNumber(set, collectorNumber, language);
	}
	
	get raw() {
		return {...this.owned};
	}
}

export default CollectionItem;
