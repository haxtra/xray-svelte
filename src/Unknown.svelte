<script>
export let obj;
// unused
export let app;
export let param;
export let path;

let text;
$: {
	try {
		text = obj.toString()
	} catch {
		text = 'unknown'
	}
}
</script>

<span class="xrUnknown" on:click={()=>console.log(obj)}><span class="xrLabel">?</span>{text}</span>