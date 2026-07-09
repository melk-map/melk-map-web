import axios from "axios";
import { compactCells, type H3Index } from "h3-js";

const mapAPIClient = axios.create({
	baseURL: "http://localhost:1234/properties",
	headers: {
		"Content-Type": "application/json",
	},
});

async function fetchLocationsInH3() {}

async function fetchLocationsInH3Bounds(
	h3Cells: H3Index[],
	resolution: number,
) {
	const compactedCells = compactCells(h3Cells);

	const response = await mapAPIClient.post("/h3-set", {
		h3_cells: compactedCells,
		resolution,
	});

	return response.data;
}

export default {
	fetchLocationsInH3,
	fetchLocationsInH3Bounds,
};
