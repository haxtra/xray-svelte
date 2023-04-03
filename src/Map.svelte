<script>
import ObjectRow from './ObjectRow.svelte'

export let app;
export let obj;
export let path;
// unused
export let param;
</script>

<span class="xrLabel">Map</span>

{#if !obj.size}

	<span class="xrObject xrEmpty"></span>

{:else}

	<table>
		{#each [...obj] as elem}
			{@const subpath = path+'.'+elem[0].toString()}
			<ObjectRow {app} key={elem[0].toString()} obj={elem[1]} path={subpath} />
		{/each}
	</table>

{/if}
