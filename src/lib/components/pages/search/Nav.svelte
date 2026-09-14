<script lang="ts">
	import { viewState } from "./index.svelte";

	function toggleSearchViewType() {
		switch (viewState.viewType) {
			case "map":
				viewState.viewType = "list";
				break;
			case "list":
				viewState.viewType = "map";
				break;
		}
	}
</script>

<div class="w-full py-2">
	<div></div>
	<div class="flex size-full flex-col items-center gap-2">
		<div
			class="flex size-full flex-row items-center justify-start gap-2 px-2">
			<input
				placeholder="Search... no workee yet :("
				type="text"
				class="input w-full rounded-full input-md" />
			<button class="btn rounded-full btn-outline" onclick={toggleSearchViewType}>List</button>
		</div>
	</div>
</div>
