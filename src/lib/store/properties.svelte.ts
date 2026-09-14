import api from "$lib/api";
import type { Property } from "$lib/api/property";

export default class PropertyStore {
	properties: Property[] = $state([]);
	hasPrevPage: boolean = false;
	nextPageToken?: string;

	constructor() {}

	async init() {
		const res = await api.property.getProperties();
		this.hasPrevPage = res.has_prev_page;
		this.nextPageToken = res.next_page_token;
		this.properties = res.properties;
	}

	async nextPage() {
		if (this.nextPageToken) {
			const res = await api.property.getProperties(this.nextPageToken);
			this.hasPrevPage = res.has_prev_page;
			this.nextPageToken = res.next_page_token;
			this.properties = res.properties;
		}
	}
}
