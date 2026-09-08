<script lang="ts">
	import List from "$lib/components/pages/search/List.svelte";
	import Map from "$lib/components/pages/search/Map.svelte";
	import Nav from "$lib/components/pages/search/Nav.svelte";

	let mapCoordinates = $state<[number, number]>([51.3896004, 35.6892523]);
</script>

<main class="flex size-full flex-col">
	<Map coordinates={mapCoordinates} />
</main>
