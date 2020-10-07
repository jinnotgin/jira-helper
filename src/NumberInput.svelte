<script>
	import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  export let value;

  const onKeyupHandler = (event) => {
    if (event.code == "Enter") {
      event.preventDefault();

      dispatch('valueChanged', {
        value: event.target.value,
      });
    }
  }
</script>

<input
  class="numberInput custom-numberInput"
  type="number"
  step="any"
  value={value}
  on:keyup|preventDefault={onKeyupHandler}
/>

<style>
  input.numberInput {
    width: 5ch;
    margin: 0;
    -moz-appearance: textfield;
  }

  input.numberInput:disabled {
    background: white;
    color: #666;
    cursor: not-allowed;
  }

  input.numberInput::-webkit-outer-spin-button,
  input.numberInput::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>