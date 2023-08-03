class Card {
	constructor(id, data) {
		this.id = id;
		this.oracle = {
			id: data.oracle.id,
			name: data.oracle.name
		};
		
		this.multiverseIds = data.multiverseIds;
		this.set = data.set;
		this.collectorNumber = data.collectorNumber;
		this.language = data.language;
		
		this.faces = data.faces;
		
		Object.freeze(this);
	}
	
	static forCollectorNumber(set, collectorNumber, language) {
		return Card.forCollectorNumberUnsecure(set, collectorNumber, language).catch(() => Card.forCollectorNumberUnsecure(set, collectorNumber));
	}
	
	static forCollectorNumberUnsecure(set, collectorNumber, language) {
		return fetch(`https://api.scryfall.com/cards/${set.toLowerCase()}/${collectorNumber}/${language !== undefined ? language : "en"}`)
			.then(response => response.json())
			.then(data => new Card(data.id, {
				oracle: {
					id: data.oracle_id,
					name: data.name
				},
				faces: data.card_faces !== undefined && data.card_faces[0].image_uris != undefined
					? data.card_faces.map(face => face.image_uris.png)
					: [data.image_uris.png],
				set: data.set,
				collectorNumber: data.collector_number,
				language: data.lang,
				multiverseIds: data.multiverse_ids
			}));
	}
}

export default Card;
