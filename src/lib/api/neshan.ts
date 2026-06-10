import axios from "axios";
import type { Point } from "./types";
import { fromError } from "zod-validation-error";
import { PUBLIC_NESHAN_API_KEY } from "$env/static/public";

const neshanAPIClient = axios.create({
	baseURL: "https://api.neshan.org/",
	headers: {
		"Content-Type": "application/json",
		"Api-Key": PUBLIC_NESHAN_API_KEY,
	},
});

interface NeshanLocation {
	latitude: number;
	longtitude: number;
}

interface NeshanRequest {
	address: string;
	province?: string;
	city?: string;
	extent?: {
		southWest: NeshanLocation;
		northWest: NeshanLocation;
	};
	location?: NeshanLocation;
}

async function search(location: string): Promise<Point[]> {
	const points: Point[] = [];

	const req: NeshanRequest = {
		address: location,
	};

	try {
		const res = await neshanAPIClient.get(
			`/geocoding/v1?json=${encodeURIComponent(JSON.stringify(req))}`,
		);

		parsedFeatureCollection.features.forEach((feature) => {
			const point: Point = {
				name: feature.properties.display_name,
				coordinates: [
					feature.geometry.coordinates[0],
					feature.geometry.coordinates[1],
				],
			};

			points.push(point);
		});

		console.log(parsedFeatureCollection);
	} catch (error) {
		const validationError = fromError(error);
		console.error(validationError.toString());
	}

	return points;
}

export default {
	search,
};
