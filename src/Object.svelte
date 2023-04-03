<script>
import ObjectRow from './ObjectRow.svelte'

export let app;
export let obj;
export let path;
// unused
export let param;

$: keys = Object.keys(obj)

</script>

{#if !keys.length}

	<span class="xrObject xrEmpty"></span>

{:else}

	<table>
		{#each keys as key}
			{@const subpath = path+'.'+key}
			<ObjectRow {app} {key} obj={obj[key]} path={subpath} />
		{/each}
	</table>

{/if}
