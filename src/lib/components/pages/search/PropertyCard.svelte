<script lang="ts">
	interface Props {
		images?: string[];
		title: string;
		property_type: string;
		price?: number;
		area?: number;
		bedrooms?: number;
		restrooms?: number;
		address?: string;
	}
</script>

<div class="card bg-base-100">
	<figure>
		<img
			src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
			alt="hmmm" />
	</figure>
	<div class="card-body">
		<h2 class="card-title">Title</h2>
		<p>
			A card component has a figure, a body part, and inside body there
			are title and actions parts
		</p>
		<div class="card-actions justify-end">
			<button class="btn btn-primary">Buy Now</button>
		</div>
	</div>
</div>
