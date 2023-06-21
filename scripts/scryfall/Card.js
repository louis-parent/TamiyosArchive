class Card {
	constructor(id, data) {
		this.id = id;
		this.oracle = {
			id: data.oracle.id,
			name: data.oracle.name
		};
		this.faces = data.faces;
		Object.freeze(this);
	}
	
	static forCollectorNumber(set, collectorNumber) {
		return fetch(`https://api.scryfall.com/cards/${set.toLowerCase()}/${collectorNumber}/fr`)
			.then(response => response.json())
			.then(data => new Card(data.id, {
				oracle: {
					id: data.oracle_id,
					name: data.name
				},
				faces: data.card_faces !== undefined
					? data.card_faces.map(face => face.image_uris.png)
					: [data.image_uris.png]
			}));
	}
}

export default Card;
