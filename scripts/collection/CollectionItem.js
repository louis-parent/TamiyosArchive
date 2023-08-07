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
	
	get newestCard() {
		const set = Object.keys(this.owned)[0];
		const collectorNumber = Object.keys(this.owned[set])[0];
		const language = Object.keys(this.owned[set][collectorNumber])[0];

		return {
			set: set,
			collectorNumber: collectorNumber,
			language: language
		};
	}
	
	get count() {
		let count = 0;
		
		for(const set in this.owned) {
			for(const collectorNumber in this.owned[set]) {
				for(const language in this.owned[set][collectorNumber]) {
					count += this.owned[set][collectorNumber][language].foil;
					count += this.owned[set][collectorNumber][language].nonFoil;
				}
			}
		}
		
		return count;
	}
	
	get foilCount() {
		let count = 0;
		
		for(const set in this.owned) {
			for(const collectorNumber in this.owned[set]) {
				for(const language in this.owned[set][collectorNumber]) {
					count += this.owned[set][collectorNumber][language].foil;
				}
			}
		}
		
		return count;
	}
	
	get nonFoilCount() {
		let count = 0;
		
		for(const set in this.owned) {
			for(const collectorNumber in this.owned[set]) {
				for(const language in this.owned[set][collectorNumber]) {
					count += this.owned[set][collectorNumber][language].nonFoil;
				}
			}
		}
		
		return count;
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
	
	raw() {
		return {...this.owned};
	}
	
	async toCSV() {
		let csv = "";
		let isFirst = true;
		
		for(const set in this.owned) {
			for(const collectorNumber in this.owned[set]) {
				for(const language in this.owned[set][collectorNumber]) {
					const card = await Scryfall.getCardByCollectorNumber(set, collectorNumber, language);
					
					if(isFirst) {
						isFirst = false;
					}
					else {
						csv += "\n";
					}
					
					csv += card.multiverseIds[0] + 
							",\"" + card.oracle.name.split("//")[0].trim() + "\"" +
							"," + collectorNumber +
							",\"" + set.toUpperCase() + "\"" +
							"," + (this.owned[set][collectorNumber][language].nonFoil + this.owned[set][collectorNumber][language].foil) +
							"," + this.owned[set][collectorNumber][language].foil;
				}
			}
		}
		
		return csv;
	}
}

export default CollectionItem;
