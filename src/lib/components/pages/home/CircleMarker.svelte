<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar";

	interface Props {
		h3Index: string;
	}

	let { h3Index }: Props = $props();
</script>

<div
	class="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background">
	<Avatar.Root>
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>
	<Avatar.Root>
		<Avatar.Image src="https://github.com/leerob.png" alt="@leerob" />
		<Avatar.Fallback>LR</Avatar.Fallback>
	</Avatar.Root>
	<Avatar.Root>
		<Avatar.Image
			src="https://github.com/evilrabbit.png"
			alt="@evilrabbit" />
		<Avatar.Fallback>ER</Avatar.Fallback>
	</Avatar.Root>
</div>

<style></style>
