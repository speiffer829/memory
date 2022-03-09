<script lang="ts">
	import { flip } from 'svelte/animate';

	interface emojiT {
		id?: number;
		emoji?: string;
		matchId?: number;
		matched?: boolean;
	}

	const emojis: emojiT[] = [
		{ matchId: 0, emoji: '🍆' },
		{ matchId: 1, emoji: '🖕' },
		{ matchId: 2, emoji: '🇺🇸' },
		{ matchId: 3, emoji: '😎' },
		{ matchId: 4, emoji: '😁' },
		{ matchId: 5, emoji: '😂' },
		{ matchId: 6, emoji: '😬' },
		{ matchId: 7, emoji: '😶' },
	];

	let chosen: emojiT[] = [];

	let disableButtons: boolean = false;

	let tries: number = 0;

	$: isDone = grid.every((item: emojiT) => item.matched);
	$: pairCount = grid.filter((item: emojiT) => item.matched).length / 2;

	function checkChosen() {
		tries++;
		disableButtons = true;

		if (chosen[0].matchId === chosen[1].matchId) {
			grid = grid.map((item: emojiT) => {
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

	let grid: emojiT[] = createGrid();
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
		<button
			class:matched
			class:chosen={chosen.some((item) => item.id === id)}
			on:click={() => handleClick({ id, matchId })}
			animate:flip={{ duration: 200 }}
			disabled={disableButtons ||
				matched ||
				chosen.some((item) => item.id === id)}
		>
			<span>{emoji}</span>
		</button>
	{/each}
</div>
<button on:click={() => (grid = createGrid())} class="reset-btn">Reset</button>

<style lang="scss">
	h1 > strong {
		color: var(--purple);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-gap: 1rem;
		max-width: 600px;
		width: 100%;
		margin: 10px auto;
		touch-action: manipulation;

		@media screen and (min-width: 480px) {
			grid-gap: 2rem;
		}
	}
	.grid > button {
		font-size: 2rem;
		text-align: center;
		border-radius: 1rem;
		background: none;
		display: grid;
		justify-content: center;
		align-items: center;
		align-content: center;
		border: solid #333 3px;
		aspect-ratio: 1/1;
		transition: all 300ms;
		overflow: hidden;
		touch-action: manipulation;

		&:after {
			content: '';
			display: none;
		}

		@media screen and (min-width: 480px) {
			font-size: 3rem;
		}

		span {
			transform: scale(0.01);
			display: block;
			max-width: 100%;
			touch-action: manipulation;
			transition: all 200ms;
		}

		&.chosen {
			background: var(--gray);
			span {
				transform: scale(1);
				opacity: 1;
			}
		}

		&.matched {
			background: var(--green);
			span {
				transform: scale(1);
				opacity: 1;
			}
		}
	}

	.reset-btn {
		font-size: 1rem;
		background: var(--purple);
		color: var(--light);
		font-weight: 900;
		border: solid 3px #333;
		padding: 0.75rem 2rem;
		border-radius: 1rem;
	}

	button {
		cursor: pointer;
	}
</style>
