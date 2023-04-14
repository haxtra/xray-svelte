<script>
	import XRayEngine from './engine.js'
	import './xray.css'

	export let obj;
	export let header = true
	export let title = 'XRay'
	export let minimize = false
	export let collapse = false
	export let collapseExcept = false

	const app = new XRayEngine(obj, {collapse, collapseExcept})

	$: params = app.value(obj, '$')

	const togglePanel = () => minimize = !minimize

	function promptPath(e){
		const title = e.target.title
		if(title){
			e.stopPropagation()
			e.preventDefault()
			prompt('Object path:', title)
		}
	}

</script>

<div class="XRay" on:contextmenu={promptPath}>

	{#if header}
		<div class="xrHeader" class:xrMinimized={minimize} on:click={togglePanel}>
			<div class="xrTitle">{title}</div>
		</div>
	{/if}

	{#if !minimize}
		<div class="xrContent">
			<svelte:component {app} this={params[0]} param={params[1]} obj={params[2]} path="$" />
		</div>
	{/if}

</div>