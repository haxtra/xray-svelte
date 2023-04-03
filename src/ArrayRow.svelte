<script>
export let app;
export let i;
export let obj;
export let path;

let isCollapsed = app.isCollapsed(path)

function toggleCollapse(){
	isCollapsed = app.toggleCollapse(path)
}

$: params = app.value(obj, path)

</script>

<tr class:xrCollapsed={isCollapsed}>
	<td class="xrKey xrArray" title={path} on:click={toggleCollapse}>{i}</td>
	<td class="xrValue">
		{#if !isCollapsed}
			<svelte:component {app} this={params[0]} param={params[1]} obj={params[2]} {path} />
		{/if}
	</td>
</tr>
