<script>
import ObjectRow from './ObjectRow.svelte'

export let app;
export let obj;
export let path;
// unused
export let param;

let keys, title;
$: {
	keys = app.instanceSniffer(obj)
	title = (obj.constructor.name || 'anonymous') + ' instance'
}

</script>

<span class="xrLabel xrInstance">{title}</span>

{#if keys.length}

	<table>
		{#each keys as key}
			{@const subpath = path+'.'+key}

			<ObjectRow {app} {key} obj={obj[key]} path={subpath} />

		{/each}
	</table>

{/if}
