<script>
export let app;
export let obj;
export let path;
// unused
export let param;
</script>

<span class="xrLabel">Set</span>

{#if !obj.size}

	<span class="xrArray xrEmpty"></span>

{:else}

	<table>
		{#each [...obj] as elem}
			{@const subobj = app.value(elem)}
			<tr><td><svelte:component this={subobj[0]} {app} param={subobj[1]} obj={subobj[2]} {path}/></td></tr>
		{/each}
	</table>

{/if}
