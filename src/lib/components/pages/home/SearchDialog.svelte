<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as InputGroup from "$lib/components/ui/input-group";
	import SearchIcon from "@lucide/svelte/icons/search";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import * as Empty from "$lib/components/ui/empty";
	import * as Item from "$lib/components/ui/item";
	import MapPinIcon from "@lucide/svelte/icons/map-pin";
	import api from "$lib/api";
	import type { Point } from "$lib/api/types";

	interface Props {
		value: string;
		open: boolean;
		coordinates: [number, number];
	}

	let {
		value = $bindable(),
		open = $bindable(),
		coordinates = $bindable(),
	}: Props = $props();

	let searchProviderValue = $state<"google" | "nominatim">("nominatim");
	let searchResults = $state<Point[]>([]);

	let searchState = $state<"none" | "loading" | "finished">("none");

	async function searchLocation() {
		searchState = "loading";
		searchResults = await api.nominatim.search(value);
		searchState = "finished";
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Search</Dialog.Title>
		</Dialog.Header>
		<InputGroup.Root>
			<InputGroup.Addon align="inline-start">
				<SearchIcon />
			</InputGroup.Addon>
			<InputGroup.Input bind:value placeholder="Search" />
			<InputGroup.Addon align="inline-end">
				<InputGroup.Button
					disabled={searchState === "loading"}
					onclick={searchLocation}
					variant="secondary">Search</InputGroup.Button>
			</InputGroup.Addon>
			<InputGroup.Addon align="inline-end">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<InputGroup.Button
								{...props}
								variant="outline"
								class="text-xs">
								{searchProviderValue}
								<ChevronDownIcon />
							</InputGroup.Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Group>
							<DropdownMenu.Label
								>Select Provider</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.RadioGroup
								bind:value={searchProviderValue}>
								<DropdownMenu.RadioItem value="nominatim"
									>Nominatim</DropdownMenu.RadioItem>
								<DropdownMenu.RadioItem value="google"
									>Google</DropdownMenu.RadioItem>
							</DropdownMenu.RadioGroup>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</InputGroup.Addon>
		</InputGroup.Root>
		<div class="flex max-h-[50vh] flex-col overflow-y-auto">
			{#if searchState === "none" || searchResults.length === 0}
				<Empty.Root>
					<Empty.Header>
						<Empty.Media variant="icon">
							<MapPinIcon />
						</Empty.Media>
						<Empty.Title>Search</Empty.Title>
					</Empty.Header>
				</Empty.Root>
			{:else}
				{#each searchResults as res, idx (idx)}
					<Item.Root
						onclick={() => {
							coordinates = [
								res.coordinates[0],
								res.coordinates[1],
							];
							open = false;
						}}>
						<Item.Content>
							<Item.Title>{res.name}</Item.Title>
						</Item.Content>
					</Item.Root>
				{/each}
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
