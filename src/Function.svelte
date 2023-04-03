<script>
import ObjectRow from './ObjectRow.svelte'

export let app;
export let obj;
export let path;
// unused
export let param;

let keys, objType, fnType, fnName;
$: {
	keys = app.functionSniffer(obj)
	objType = Object.prototype.toString.call(obj)
	fnType = (/\[object (\w+)\]/.exec(objType))[1]
	fnName = obj.name ? obj.name : '[Anonymous]'
}

</script>


<span class="xrFunction">{fnType} {fnName}</span>

{#if keys.length}

	<table>
		{#each keys as key}
			{@const subpath = path+'.'+key}

			<ObjectRow {app} {key} obj={obj[key]} path={subpath} />

		{/each}
	</table>

{/if}
