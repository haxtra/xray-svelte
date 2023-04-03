<script>
export let app;
export let key;
export let obj;
export let path;

let isCollapsed = app.isCollapsed(path)

function toggleCollapse(){
	isCollapsed = app.toggleCollapse(path)
}

$: params = app.value(obj, path)

</script>

<tr class:xrCollapsed={isCollapsed}>
	<td class="xrKey" title={path} on:click={toggleCollapse}>{key}</td>
	<td class="xrValue">
		{#if !isCollapsed}
			<svelte:component {app} this={params[0]} param={params[1]} obj={params[2]} {path} />
		{/if}
	</td>
</tr>
