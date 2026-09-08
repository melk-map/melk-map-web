<script lang="ts">
	import { onMount } from "svelte";
	import { addProtocol, AttributionControl, GeoJSONSource, Map, setRTLTextPlugin, type Feature } from "maplibre-gl";
	import "maplibre-gl/dist/maplibre-gl.css";
	import { Protocol } from "pmtiles";
	import {
		POLYGON_TO_CELLS_FLAGS,
		polygonToCellsExperimental,
		type H3Index,
	} from "h3-js";
	import api from "$lib/api";
	import { SvelteMap } from "svelte/reactivity";

	interface Props {
		coordinates: [number, number];
	}

	let { coordinates }: Props = $props();

	const DEFAULT_ZOOM = 10;
	const MIN_ZOOM = 4;
	const MAX_ZOOM = 20;
	const MIN_H3_RES = 6;
	const MAX_H3_RES = 9;
	const H3_RES_9_MIN_ZOOM = 15;
	const H3_RES_8_MIN_ZOOM = 13.5;
	const H3_RES_7_MIN_ZOOM = 12.5;

	let map: Map | undefined = $state();
	let mapContainer: HTMLElement | undefined = $state();
	let h3Resolution: 6 | 7 | 8 | 9 = $state(zoomToResolution(DEFAULT_ZOOM));
	let h3CircleRadius: number = $derived.by(() => {
		switch (h3Resolution) {
			case 9:
				return 250;
			case 8:
				return 125;
			case 7:
				return 62.5;
			case 6:
				return 31.25;
		}
	});

	function zoomToResolution(zoom: number) {
		if (zoom > H3_RES_9_MIN_ZOOM) {
			return 9;
		} else if (zoom >= H3_RES_8_MIN_ZOOM && zoom < H3_RES_9_MIN_ZOOM) {
			return 8;
		} else if (zoom >= H3_RES_7_MIN_ZOOM && zoom < H3_RES_8_MIN_ZOOM) {
			return 7;
		} else {
			return 6;
		}

		/*
		return Math.floor(
			((zoom - minZoom) / (maxZoom - minZoom)) *
				((maxZoom - minZoom) / (maxResolution - minResolution)) +
				minResolution,
		);
		*/
	}

	onMount(() => {
		if (!mapContainer) return;

		let protocol = new Protocol();
		addProtocol("pmtiles", protocol.tile);

		setRTLTextPlugin(
			"https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js",
			true, // Lazy load the plugin
		);

		map = new Map({
			container: mapContainer,
			style: "/map/styles/dark.json",
			center: coordinates,
			attributionControl: false,
			minZoom: MIN_ZOOM,
			maxZoom: MAX_ZOOM,
			zoom: DEFAULT_ZOOM,
		});

		// add openstreetmap attributions back
		map.addControl(
			new AttributionControl({ compact: true }),
			"bottom-left",
		);

		const cellCache = new SvelteMap<H3Index, Feature | null>();

		const propertiesSourceID = "properties";
		const propertiesClusterLayerID = `${propertiesSourceID}-clusters-layer`;
		const propertiesClusterCountLayerID = `${propertiesSourceID}-cluster-count-layer`;
		const propertiesUnclusteredLayerID = `${propertiesSourceID}-unclustered-layer`;
		let propertiesSource = map.getSource(propertiesSourceID) as
			| GeoJSONSource
			| undefined;

		const h3SourceID = "h3";
		const h3ClustersLayerID = `${h3SourceID}-clusters-layer`;
		const h3ClusterCountLayerID = `${h3SourceID}-cluster-count-layer`;
		const h3UnclusteredLayerID = `${h3SourceID}-unclustered-layer`;
		let h3Source = map.getSource(h3SourceID) as
			| GeoJSONSource
			| undefined;

		let overrideMove = false;

		map.on("load", async () => {
			if (map) map.resize();

			map!.addSource(propertiesSourceID, {
				type: "geojson",
				data: {
					type: "FeatureCollection",
					features: [],
				},
				cluster: true,
				maxzoom: MAX_ZOOM,
			});

			map!.addLayer({
				id: propertiesClusterLayerID,
				type: "circle",
				source: propertiesSourceID,
				filter: ["has", "point_count"],
				paint: {
					"circle-color": "#ff0000",
					"circle-radius": [
						"step",
						["get", "point_count"],
						20,
						100,
						30,
						750,
						40,
					],
				},
				minzoom: H3_RES_9_MIN_ZOOM,
			});

			map!.addLayer({
				id: propertiesClusterCountLayerID,
				type: "symbol",
				source: propertiesSourceID,
				filter: ["has", "point_count"],
				layout: {
					"text-field": "{point_count_abbreviated}",
					"text-font": ["Noto Sans Regular"],
					"text-size": 12,
				},
				minzoom: H3_RES_9_MIN_ZOOM,
			});

			map!.addLayer({
				id: propertiesUnclusteredLayerID,
				type: "circle",
				source: propertiesSourceID,
				filter: ["!", ["has", "point_count"]],
				paint: {
					"circle-color": "#11b4da",
					"circle-radius": 4,
					"circle-stroke-width": 1,
					"circle-stroke-color": "#fff",
				},
				minzoom: H3_RES_9_MIN_ZOOM,
			});

			map!.on("click", propertiesClusterLayerID, async (e) => {
				const features = map!.queryRenderedFeatures(e.point, {
					layers: [propertiesClusterLayerID],
				});
				const clusterId = features[0].properties.cluster_id;
				const zoom =
					await propertiesSource!.getClusterExpansionZoom(clusterId);

				overrideMove = true;
				map!.easeTo({
					center: features[0].geometry.coordinates,
					zoom,
				});
				overrideMove = false;
			});

			map!.addSource(h3SourceID, {
				type: "geojson",
				data: {
					type: "FeatureCollection",
					features: [],
				},
				maxzoom: H3_RES_9_MIN_ZOOM,
			});

			map!.addLayer({
				id: h3ClustersLayerID,
				type: "circle",
				source: h3SourceID,
				filter: ["has", "density_index"],
				paint: {
					"circle-color": "#ff0000",
					"circle-radius": h3CircleRadius /*["get", "radius"]*/,
				},
				maxzoom: H3_RES_9_MIN_ZOOM,
			});

			map!.addLayer({
				id: h3ClusterCountLayerID,
				type: "symbol",
				source: h3SourceID,
				filter: ["has", "density_index"],
				layout: {
					"text-field": "{density_index}",
					"text-font": ["Noto Sans Regular"],
					"text-size": 12,
				},
				maxzoom: H3_RES_9_MIN_ZOOM,
			});

			map!.addLayer({
				id: h3UnclusteredLayerID,
				type: "circle",
				source: h3SourceID,
				filter: ["!", ["has", "density_index"]],
				paint: {
					"circle-color": "#11b4da",
					"circle-radius": 4,
					"circle-stroke-width": 1,
					"circle-stroke-color": "#fff",
				},
				maxzoom: H3_RES_9_MIN_ZOOM,
			});

			map!.on("click", h3ClustersLayerID, async (e) => {
				const features = map!.queryRenderedFeatures(e.point, {
					layers: [h3ClustersLayerID],
				});

				let zoom: number;

				switch (h3Resolution) {
					case 6:
						zoom = H3_RES_7_MIN_ZOOM;
						break;
					case 7:
						zoom = H3_RES_8_MIN_ZOOM;
						break;
					case 8:
						zoom = H3_RES_9_MIN_ZOOM;
						break;
					default:
						return;
				}

				overrideMove = true;
				map!.easeTo({
					center: features[0].geometry.coordinates,
					zoom: zoom + 0.01,
				});
				overrideMove = false;
			});

			h3Source = map!.getSource(h3SourceID);
			propertiesSource = map!.getSource(propertiesSourceID);
		});

		// update map boundaries on moveend
		map.on("moveend", async () => {
			if (overrideMove) return;

			const boundaries = map!.getBounds();
			const sw = boundaries.getSouthWest();
			const ne = boundaries.getNorthEast();
			const polygon = [
				[sw.lng, sw.lat],
				[ne.lng, sw.lat],
				[ne.lng, ne.lat],
				[sw.lng, ne.lat],
				[sw.lng, sw.lat],
			];

			h3Resolution = zoomToResolution(map!.getZoom());

			const h3Cells = polygonToCellsExperimental(
				polygon,
				h3Resolution,
				POLYGON_TO_CELLS_FLAGS.containmentOverlapping,
				true,
			);

			const filteredCells = h3Cells.filter(
				(cell) => !cellCache.has(cell),
			);

			// make sure all filtered cells are marked as null in the cache
			// to avoid fetching them again
			for (const cell of filteredCells) {
				cellCache.set(cell, null);
			}

			if (filteredCells.length != 0) {
				const featuresInBounds = await api.map.fetchLocationsInH3Bounds(
					filteredCells,
					h3Resolution,
				);

				for (const feature of featuresInBounds.Features) {
					cellCache.set(feature.properties.h3_index, feature);
				}
			}

			const features: Feature[] = [];

			for (const cell of h3Cells) {
				const feature = cellCache.get(cell);
				if (feature) features.push(feature);
			}

			if (h3Resolution != MAX_H3_RES) {
				h3Source!.setData({
					type: "FeatureCollection",
					features,
				});
			} else {
				propertiesSource!.setData({
					type: "FeatureCollection",
					features,
				});
			}
		});
	});
</script>

<div class="h-full w-full" bind:this={mapContainer}></div>
