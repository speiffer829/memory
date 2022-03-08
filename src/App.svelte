<script>
  import { flip } from "svelte/animate";

  const emojis = [
    { matchId: 0, emoji: "🍆" },
    { matchId: 1, emoji: "🖕" },
    { matchId: 2, emoji: "🇺🇸" },
    { matchId: 3, emoji: "😎" },
    { matchId: 4, emoji: "😁" },
    { matchId: 5, emoji: "😂" },
    { matchId: 6, emoji: "😬" },
    { matchId: 7, emoji: "😶" },
  ];

  let chosen = [];

  let disableButtons = false;

  let tries = 0;

  $: isDone = grid.every((item) => item.matched);
  $: pairCount = grid.filter((item) => item.matched).length / 2;

  function checkChosen() {
    tries++;
    disableButtons = true;

    if (chosen[0].matchId === chosen[1].matchId) {
      grid = grid.map((item) => {
        if (item.id === chosen[0].id || item.id === chosen[1].id) {
          item.matched = true;
        }
        return item;
      });
      chosen = [];
      disableButtons = false;
    } else {
      setTimeout(() => {
        chosen = [];
        disableButtons = false;
      }, 700);
    }
  }

  function handleClick(item) {
    chosen = [...chosen, item];
    if (chosen.length === 2) checkChosen();
  }

  let grid = createGrid();
  function createGrid() {
    chosen = [];
    tries = 0;
    return [...emojis, ...emojis]
      .map((item, index) => {
        return {
          shuffleIndex: Math.random() * 100,
          value: {
            id: index,
            matched: false,
            ...item,
          },
        };
      })
      .sort((a, b) => a.shuffleIndex - b.shuffleIndex)
      .map(({ value }) => value);
  }
</script>

<button on:click={() => (grid = createGrid())} class="reset-btn">Reset</button>
{#if isDone}
  <h1>Congrats! It took you <strong>{tries}</strong> tries!</h1>
{:else}
  <h1>Try to match the pairs!</h1>
{/if}

<div class="stat-row">
  <p>Tries: {tries}</p>
  <p>Pairs Found: {pairCount}/{grid.length / 2}</p>
</div>
<div class="grid">
  {#each grid as { emoji, id, matchId, matched } (id)}
    <button class:matched class:chosen={chosen.some((item) => item.id === id)} on:click={() => handleClick({ id, matchId })} animate:flip={{ duration: 200 }} disabled={disableButtons || matched || chosen.some((item) => item.id === id)}>
      <span>{emoji}</span>
    </button>
  {/each}
</div>

<style lang="postcss">
  :global(body) {
    background: #f9ffff;
    text-align: center;
  }

  h1 > strong {
    color: #aa9efb;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 1rem;
    max-width: 600px;
    margin: 10px auto;

    @media screen and (min-width: 480px) {
      grid-gap: 2rem;
    }
  }
  .grid > button {
    font-size: 2rem;
    text-align: center;
    border-radius: 1rem;
    background: none;
    border: solid #333 3px;
    aspect-ratio: 1/1;
    transition: all 300ms;
    overflow: hidden;

    @media screen and (min-width: 480px) {
      font-size: 3rem;
    }

    span {
      transform: scale(0.01);
      display: block;
      transition: all 200ms;
    }

    &.chosen {
      background: #dadddd;
      span {
        transform: scale(1);
        opacity: 1;
      }
    }

    &.matched {
      background: #9efbdc;
      span {
        transform: scale(1);
        opacity: 1;
      }
    }
  }

  .reset-btn {
    font-size: 1rem;
    background: #9eccfb;
    border: solid 3px #333;
    padding: 0.75rem 2rem;
    border-radius: 1rem;
  }

  button {
    cursor: pointer;
  }
</style>
