<script lang="ts">
	import { onMount } from "svelte";
	import maplibregl, { type Map } from "maplibre-gl";
	import "maplibre-gl/dist/maplibre-gl.css";
	import { Protocol } from "pmtiles";
	import testLocs from "./testLocs";
	import axios from "axios";
	import { latLngToCell } from "h3-js";

	interface Props {
		coordinates: [number, number];
	}

	let { coordinates }: Props = $props();

	let map: Map | undefined = $state();
	let mapContainer: HTMLElement | undefined = $state();

	$effect(() => {
		if (map) {
			map.flyTo({ center: coordinates, zoom: 14 });
		}
	});

	const minZoom = 4;
	const maxZoom = 20;

	function zoomToResolution(zoom: number) {
		const minResolution = 4;
		const maxResolution = 8;

		return Math.floor(
			((zoom - minZoom) / (maxZoom - minZoom)) *
				((maxZoom - minZoom) / (maxResolution - minResolution)) +
				minResolution,
		);
	}

	onMount(() => {
		if (!mapContainer) return;

		let protocol = new Protocol();
		maplibregl.addProtocol("pmtiles", protocol.tile);

		maplibregl.setRTLTextPlugin(
			"https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js",
			true, // Lazy load the plugin
		);

		map = new maplibregl.Map({
			container: mapContainer,
			style: "/map/styles/light.json",
			center: coordinates,
			attributionControl: false,
			minZoom,
			maxZoom,
			zoom: 10,
		});

		// add openstreetmap attributions back
		map.addControl(
			new maplibregl.AttributionControl({ compact: true }),
			"bottom-left",
		);

		// update map boundaries on moveend
		map.on("moveend", async () => {
			const center = map!.getCenter();
			const zoom = map!.getZoom();
			const h3Resolution = zoomToResolution(zoom);

			console.log(latLngToCell(center.lat, center.lng, 9));
		});

		for (const location of testLocs) {
			new maplibregl.Marker()
				.setLngLat([location[0], location[1]])
				.addTo(map);
		}

		map.on("load", () => {
			if (map) {
				map.resize();
			}
		});
	});
</script>

<div class="h-full w-full" bind:this={mapContainer}></div>
