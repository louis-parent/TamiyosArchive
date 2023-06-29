import Scryfall from "../scryfall/Scryfall.js";
import CollectionItem from "./CollectionItem.js";

class CardCollection {
	static STORAGE_NAME = "collection";
	
	constructor(cards) {
		this.collection = new Object();
		
		for(const oracle of Object.keys(cards || {})) {
			for(const set of Object.keys(cards[oracle] || {})) {
				for(const collectorNumber of Object.keys(cards[oracle][set] || {})) {
					for(const language of Object.keys(cards[oracle][set][collectorNumber] || {})) {
						this.add(oracle, set, collectorNumber, language, true, cards[oracle][set][collectorNumber][language].foil || 0);
						this.add(oracle, set, collectorNumber, language, false, cards[oracle][set][collectorNumber][language].nonFoil || 0);
					}
				}
			}
		}
	}
	
	add(oracle, set, collectorNumber, language, isFoil, number) {
		if(this.collection[oracle] === undefined) {
			this.collection[oracle] = new CollectionItem(oracle);
		}
		
		this.collection[oracle].add(set, collectorNumber, language, isFoil, number);
	}
	
	remove(oracle, set, collectorNumber, language, isFoil, number) {
		if(this.collection[oracle] === undefined) {
			this.collection[oracle].remove(set, collectorNumber, language, isFoil, number);
		}
	}
	
	synchronized(callback) {
		callback(this);
		this.saveToStorage();
	}
	
	saveToStorage() {
		localStorage.setItem(CardCollection.STORAGE_NAME, JSON.stringify(this.raw));
	}
	
	get cards() {
		const cards = new Array();
		 
		for(const oracle in this.collection) {
			cards.push(this.collection[oracle].newestCard);
		}
		
		return Promise.all(cards);
	}
	
	get raw() {
		const raw = new Object();
		
		for(const oracle in this.collection) {
			raw[oracle] = this.collection[oracle].raw;
		}
		
		return raw;
	}
	
	static loadFromStorage() {
		return new CardCollection(JSON.parse(localStorage.getItem(CardCollection.STORAGE_NAME)));
	}
	
	static clearFromStorage() {
		localStorage.removeItem(CardCollection.STORAGE_NAME);
	}
}

export default CardCollection.loadFromStorage();