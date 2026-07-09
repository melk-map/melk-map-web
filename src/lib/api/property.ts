import axios from "axios";

const propertyAPIClient = axios.create({
	baseURL: "http://localhost:1234/properties",
	headers: {
		"Content-Type": "application/json",
	},
});

interface PropertyResponse {
	properties: Property[];
}

interface Property {
	title: string;
	latitude: number;
	longitude: number;
	h3_resolution_4: string;
	h3_resolution_6: string;
	h3_resolution_8: string;
	location_type: string;
}

async function h3CellToProperties(h3Cell: string): Promise<PropertyResponse> {
	const response = await propertyAPIClient.get<PropertyResponse>(
		`/h3?cell=${h3Cell}`,
	);
	return response.data;
}

async function getAllProperties(): Promise<PropertyResponse> {
	const response = await propertyAPIClient.get<PropertyResponse>(`/all`);
	return response.data;
}

export default { h3CellToProperties, getAllProperties };
