import { PUBLIC_API_URL } from "$env/static/public";
import axios from "axios";
import { compactCells, type H3Index } from "h3-js";

const mapAPIClient = axios.create({
	baseURL: `https://${PUBLIC_API_URL}/properties`,
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

	// TODO: find a way to avoid sending resolution
	const response = await mapAPIClient.post("/h3-set", {
		clusters: compactedCells,
		resolution,
	});

	return response.data;
}

async function fetchClustersInBounds(bounds: number[], resolution: number) {
	const boundsArr = [
		bounds[0].toString(),
		bounds[1].toString(),
		bounds[2].toString(),
		bounds[3].toString(),
	];
	const boundsStr = boundsArr.join(",");

	const response = await mapAPIClient.get(
		`/h3-set?resolution=${resolution.toString()}&bounds=${boundsStr}`,
	);

	return response.data;
}

export default {
	fetchLocationsInH3,
	fetchLocationsInH3Bounds,
	fetchClustersInBounds,
};
