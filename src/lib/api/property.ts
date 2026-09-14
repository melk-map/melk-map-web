import axios from "axios";
import { PUBLIC_API_URL } from "$env/static/public";

const propertyAPIClient = axios.create({
	baseURL: `http://${PUBLIC_API_URL}/properties`,
	headers: {
		"Content-Type": "application/json",
	},
});

interface PropertyResponse {
	has_prev_page: boolean;
	next_page_token: string;
	properties: Property[];
}

export interface Property {
	title: string;
	latitude: number;
	longitude: number;
	area: number;
	price: number;
	bedrooms: number;
	restrooms: number;
}

async function getProperties(pageToken?: string): Promise<PropertyResponse> {
	const path = pageToken ? `/?t_prop_pag=${pageToken}` : "/"
	const response = await propertyAPIClient.get<PropertyResponse>(path);
	return response.data;
}

export default { getProperties };
