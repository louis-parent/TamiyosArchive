class Set {
	constructor(code, name, releasedAt, icon) {
		this.code = code;
		this.name = name;
		this.releasedAt = releasedAt;
		this.icon = icon;
		Object.freeze(this);
	}
}

export default Set;
