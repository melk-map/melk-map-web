<script lang="ts">
	import { viewState } from "$lib/components/pages/search/index.svelte";
	import List from "$lib/components/pages/search/List.svelte";
	import Map from "$lib/components/pages/search/Map.svelte";
	import Nav from "$lib/components/pages/search/Nav.svelte";

//	let mapCoordinates = $state<[number, number]>([51.3896004, 35.6892523]);

	let mapCoordinates = $state<[number, number]>([0.12, 51.5]);
</script>

<main class="flex size-full flex-col">
	<Nav />
	{#if viewState.viewType === "map"}
		<Map coordinates={mapCoordinates} />
	{:else}
		<List />
	{/if}
</main>
