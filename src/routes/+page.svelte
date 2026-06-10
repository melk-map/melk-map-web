<script lang="ts">
	import Map from "$lib/components/pages/home/Map.svelte";
	import { Button } from "$lib/components/ui/button";
	import SearchDialog from "$lib/components/pages/home/SearchDialog.svelte";
	import SearchIcon from "@lucide/svelte/icons/search";

	let searchInputValue = $state("");

	let mapCoordinates = $state<[number, number]>([51.3896004, 35.6892523]);
	let isSearchOpen = $state(false);

	function openSearch() {
		isSearchOpen = true;
	}
</script>

<main class="h-full w-full">
	<Map coordinates={mapCoordinates} />
	<SearchDialog
		bind:coordinates={mapCoordinates}
		bind:value={searchInputValue}
		bind:open={isSearchOpen} />
	<Button
		class="fixed right-5 bottom-5"
		variant="secondary"
		size="lg"
		onclick={openSearch}>
		<SearchIcon /> Search
	</Button>
</main>
