class Set {
	constructor(code, name, releasedAt, icon) {
		this.code = code;
		this.name = name;
		this.releasedAt = releasedAt;
		this.icon = icon;
		Object.freeze(this);
	}
	
	static forCode(code) {
		return fetch(`https://api.scryfall.com/sets/${code.toLowerCase()}`)
		.then(response => response.json())
		.then(data => Set.fromRaw(data));
	}
	
	static get all() {
		return fetch(`https://api.scryfall.com/sets`)
		.then(response => response.json())
		.then(data => data.data.map(set => Set.fromRaw(set)));
	}
	
	static fromRaw(data) {
		return new Set(data.code.toUpperCase(), data.name, new Date(data.released_at), data.icon_svg_uri);
	}
}

export default Set;
