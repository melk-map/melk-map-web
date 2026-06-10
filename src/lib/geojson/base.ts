import * as z from "zod";
import {
	GeoJSONBBoxGenericSchema,
	type GeoJSONBBoxGenericSchemaType,
} from "./bbox";
import type { GeoJSONAnyPosition } from "./geometry/position";

export type GeoJSONBaseSchemaShape<P extends GeoJSONAnyPosition> = {
	bbox: z.ZodOptional<GeoJSONBBoxGenericSchemaType<P>>;
};

export type GeoJSONBaseSchemaType<P extends GeoJSONAnyPosition> = z.ZodObject<
	GeoJSONBaseSchemaShape<P>
>;

export const GeoJSONBaseSchema = <P extends GeoJSONAnyPosition>(
	positionSchema: z.ZodType<P>,
): GeoJSONBaseSchemaType<P> =>
	z.object({
		bbox: GeoJSONBBoxGenericSchema(positionSchema).optional(),
	});
