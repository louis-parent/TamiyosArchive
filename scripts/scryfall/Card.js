import Set from "./Set.js";

class Card {
	static MAX_BATCH_SIZE = 75;
		
	constructor(id, data) {
		this.id = id;
		this.oracle = {
			id: data.oracle.id,
			name: data.oracle.name,
			manaCost: data.oracle.manaCost,
			text: data.oracle_text
		};
		
		this.multiverseIds = data.multiverseIds;
		this.setCode = data.set;
		this.collectorNumber = data.collectorNumber;
		this.rarity = data.rarity
		this.language = data.language;
		
		this.faces = data.faces;
		
		this.localization = {
			name: data.localization.name,
			text: data.localization.text,
			type: data.localization.type
		};
		
		Object.freeze(this);
	}
	
	get set() {
		return Set.forCode(this.setCode);
	}
	
	static forCollectorNumber(set, collectorNumber, language) {
		return Card.forCollectorNumberUnsecure(set, collectorNumber, language).catch(() => Card.forCollectorNumberUnsecure(set, collectorNumber, "en").catch(() => Card.forCollectorNumberUnsecure(set, collectorNumber, "ph")));
	}
	
	static forCollectorNumberUnsecure(set, collectorNumber, language) {
		return fetch(`https://api.scryfall.com/cards/${set.toLowerCase()}/${collectorNumber}/${language !== undefined ? language : "en"}`)
		.then(response => response.json())
		.then(data => Card.fromRaw(data));
	}
	
	static forConstraints(constraints) {
		if(constraints.length > Card.MAX_BATCH_SIZE) throw new Error("Cannot get a batch of card with more of " + Card.MAX_BATCH_SIZE + " cards");
		
		return fetch("https://api.scryfall.com/cards/collection", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				identifiers: constraints
			})
		})
		.then((response) => response.json())
		.then(data => {
			return data.data.map(card => Card.fromRaw(card))
		});
	}
	
	static fromRaw(data) {
		return new Card(data.id, {
			oracle: {
				id: data.oracle_id,
				name: data.name,
				manaCost: data.mana_cost
			},
			faces: data.card_faces !== undefined && data.card_faces[0].image_uris != undefined
				? data.card_faces.map(face => face.image_uris.png)
				: [data.image_uris.png],
			set: data.set,
			collectorNumber: data.collector_number,
			language: data.lang,
			multiverseIds: data.multiverse_ids,
			rarity: data.rarity,
			localization: {
				name: data.printed_name || data.name,
				text: data.printed_text || data.oracle_text,
				type: data.printed_type_line || data.type_line
			}
		});
	}
}

export default Card;
