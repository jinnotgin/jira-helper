<script>
  import { activeSearchTerm } from "./stores.js";

  import debounce from "lodash/debounce";

  const handleInput = debounce(e => {
    activeSearchTerm.set(e.target.value);
  }, 500);
</script>

<style>
  input {
    width: 100%;
  }
</style>

<input on:input={handleInput} placeholder="Search for an issue..." />
