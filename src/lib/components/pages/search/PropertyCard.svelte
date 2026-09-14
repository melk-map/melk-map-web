<script lang="ts">
	import type { Property } from "$lib/api/property";

	interface Props {
		property: Property
	}

	let { property }: Props = $props()
</script>

<div class="card bg-base-100">
	<figure>
		<img
			src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			alt="hmmm" />
	</figure>
	<div class="card-body">
		<h2 class="card-title">{property.title}</h2>
		<p>
			Price: {property.price}, Area: {property.area}, Bedrooms: {property.bedrooms}, Restrooms: {property.restrooms}
		</p>
		<div class="card-actions justify-end">
			<button class="btn btn-primary">Buy Now</button>
		</div>
	</div>
</div>
