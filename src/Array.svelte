<script>
import ArrayRow from './ArrayRow.svelte'

export let app;
export let obj;
export let path;
// unused
export let param;
</script>

{#if !obj.length}

	<span class="xrArray xrEmpty"></span>

{:else}

	<table>
		{#each obj as elem, i}
			{@const subpath = `${path}[${i}]`}
			<ArrayRow {app} {i} obj={elem} path={subpath} />
		{/each}
	</table>

{/if}
