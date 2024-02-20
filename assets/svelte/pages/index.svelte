<script lang="ts">
  import { getContext } from "svelte";
  export let number: number;

  const locale = getContext("locale");
</script>

<p>Hi from SSR-land!</p>

<p>Number: {number}</p>
<p>Locale from svelte-context: {locale}</p>
