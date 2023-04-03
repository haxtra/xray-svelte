<script>
export let param;
export let obj;
// unused
export let app;
export let path;
</script>

<span class={"xrLabel "+param.class} on:click={()=>console.log(obj)}>{param.label}</span>