import {
	GeoJSONFeatureCollectionGenericSchema,
	GeoJSONPointSchema,
	GeoJSONPositionSchema,
} from "$lib/geojson";
import axios from "axios";
import type { Point } from "./types";
import { fromError } from "zod-validation-error";
import z from "zod";

const nominatimAPIClient = axios.create({
	baseURL: "https://nominatim.openstreetmap.org/",
});

const NominatimPropertiesSchema = z.object({
	place_id: z.number(),
	osm_type: z.string(),
	osm_id: z.number(),
	category: z.string(),
	type: z.string(),
	display_name: z.string(),
	place_rank: z.number(),
	importance: z.number(),
	icon: z.string().optional(),
	address: z.string().optional(),
	extratags: z.object().optional(),
	namedetails: z.object().optional(),
	entrances: z.object().array().optional(),
});

/* bounding box for iran
        lat_min         lat_max         lon_min         lon_max
    1. (25.0782370061, 39.7130026312, 44.1092252948, 63.3166317076)
    2. (24.8465103, 39.7816502, 44.0318908, 63.3332704)
    3. IRN: {
                sw: {
                    lat: 24.8465103,
                    lng: 44.0318908
                },
                ne: {
                    lat: 39.7816502,
                    lng: 63.3332704
                },
            },
*/

const PointOnlyGeoJSONFeatureCollectionSchema =
	GeoJSONFeatureCollectionGenericSchema(
		GeoJSONPositionSchema,
		NominatimPropertiesSchema,
		GeoJSONPointSchema,
	);

async function search(location: string): Promise<Point[]> {
	const points: Point[] = [];

	try {
		const res = await nominatimAPIClient.get(
			`/search?q=${location}&format=geojson`,
		);

		const parsedFeatureCollection =
			PointOnlyGeoJSONFeatureCollectionSchema.parse(res.data);

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
