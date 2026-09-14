<script lang="ts">
	import { onMount } from "svelte";
	import PropertyCard from "./PropertyCard.svelte";
	import PropertyStore from "$lib/store/properties.svelte";

	const propertyStore = new PropertyStore();

	function nextPage() {
		propertyStore.nextPage();
	}

	onMount(async () => {
		await propertyStore.init();
	});
</script>

<div class="flex w-full h-full flex-col gap-2">
	<div
		class="grid w-full h-full gap-2 overflow-x-hidden p-2 sm:grid-cols-2 md:grid-cols-3">
		{#each propertyStore.properties as prop}
			<PropertyCard property={prop} />
		{/each}
	</div>
	<button class="btn btn-primary" onclick={nextPage}>Next Page</button>
</div>
