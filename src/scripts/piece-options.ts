// The buttons in a piece's panel that change it: macramé colours and Choices.
import { productOrderLink } from '../lib/contact';
import { pageWithOption } from '../lib/piece-address';
import { recolorImage } from '../lib/recolor';

/** One piece's colours or Choices, as the shop's address and reset see them. */
export interface PieceOptions {
  /** The option the address should name, if any. */
  current(): string | undefined;
  /** Picks an option by its address name; unknown names are ignored. */
  pick(optionId: string): void;
  /** Back to how the piece first looked. */
  reset(): void;
}

interface Hooks {
  /** The address should change. */
  onPick(): void;
  /** The piece's photo changed size, so it needs placing again. */
  onResize(): void;
}

const NEXT_KEYS = ['ArrowRight', 'ArrowDown'];
const PREVIOUS_KEYS = ['ArrowLeft', 'ArrowUp'];
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

/**
 * Buttons that work like radio buttons: one is checked, Tab reaches it, arrow
 * keys move between them. With nothing checked, Tab reaches the first.
 */
function radioButtons(buttons: HTMLButtonElement[], choose: (button: HTMLButtonElement) => void) {
  const check = (checked: HTMLButtonElement | null) => {
    buttons.forEach((button, k) => {
      button.setAttribute('aria-checked', String(button === checked));
      button.tabIndex = (checked ? button === checked : k === 0) ? 0 : -1;
    });
  };
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => choose(button));
    button.addEventListener('keydown', (event) => {
      const move =
        NEXT_KEYS.includes(event.key) ? 1 :
        PREVIOUS_KEYS.includes(event.key) ? -1 :
        event.key === 'Home' ? -index :
        event.key === 'End' ? buttons.length - 1 - index : 0;
      if (!move) return;
      event.preventDefault();
      const target = buttons[(index + move + buttons.length) % buttons.length];
      target.focus();
      choose(target);
    });
  });
  return check;
}

function orderLinkIn(group: HTMLElement) {
  return group.closest('[data-panel-for]')!.querySelector<HTMLAnchorElement>('[data-order-title]')!;
}

const RECOLOUR_DIM_AFTER_MS = 120;
const RECOLOUR_FADE_MS = 200;

/** Macramé colours: one is always picked, starting with the piece's own. */
export function colourOptions(group: HTMLElement, image: HTMLImageElement, hooks: Hooks): PieceOptions {
  const original = image.dataset.originalSrc!;
  const sourceColor = group.dataset.sourceColor!;
  const state = group.parentElement!.querySelector('[data-swatch-state]')!;
  const swatches = [...group.querySelectorAll<HTMLButtonElement>('[data-swatch-color]')];
  const orderLink = orderLinkIn(group);
  let picked = swatches[0];
  let wantedColor = sourceColor;

  const orderWith = (swatch: HTMLButtonElement) => {
    orderLink.href = productOrderLink(
      orderLink.dataset.orderTitle!,
      pageWithOption(orderLink.dataset.orderUrl!, swatch.dataset.swatchId),
      `${swatch.dataset.swatchName} cord`
    );
  };

  async function choose(swatch: HTMLButtonElement) {
    picked = swatch;
    check(swatch);
    wantedColor = swatch.dataset.swatchColor!;
    state.textContent = wantedColor === sourceColor ? 'original' : 'recoloured';
    orderWith(swatch);
    hooks.onPick();
    const target = wantedColor;

    // Show the tap registered if the recolouring takes a moment. Only the
    // latest choice may dim, so an older, slower one can't leave it dimmed.
    const dim = window.setTimeout(() => {
      if (wantedColor === target) image.style.opacity = '0.85';
    }, RECOLOUR_DIM_AFTER_MS);
    const url = await recolorImage(original, sourceColor, target);
    window.clearTimeout(dim);
    if (wantedColor !== target) return;

    image.src = url;
    await image.decode().catch(() => {});
    image.style.opacity = '';
    image.animate([{ opacity: 0.6 }, { opacity: 1 }], { duration: RECOLOUR_FADE_MS, easing: EASE_OUT });
  }

  const check = radioButtons(swatches, choose);
  orderWith(picked);

  return {
    current: () => picked.dataset.swatchId,
    pick(optionId) {
      const swatch = swatches.find((candidate) => candidate.dataset.swatchId === optionId);
      if (swatch) choose(swatch);
    },
    reset() {
      picked = swatches[0];
      check(picked);
      orderWith(picked);
      if (wantedColor === sourceColor) return;
      wantedColor = sourceColor;
      state.textContent = 'original';
      image.src = original;
      image.style.opacity = '';
    }
  };
}

const CHOICE_FADE_MS = 200;

/** Choices: each shows its own photo of the piece. None is picked until the visitor taps one. */
export function choiceOptions(group: HTMLElement, image: HTMLImageElement, hooks: Hooks): PieceOptions {
  const state = group.parentElement!.querySelector('[data-variant-state]')!;
  const choices = [...group.querySelectorAll<HTMLButtonElement>('[data-variant-name]')];
  const orderLink = orderLinkIn(group);
  const firstOrder = orderLink.href;
  const firstHeight = image.style.getPropertyValue('--display-height');
  let picked: HTMLButtonElement | null = null;

  async function choose(choice: HTMLButtonElement) {
    picked = choice;
    check(choice);
    const name = choice.dataset.variantName!;
    state.textContent = name;
    // Mid-sentence in the message: "…with red satin ribbon."
    const inSentence = name[0].toLowerCase() + name.slice(1);
    orderLink.href = productOrderLink(
      orderLink.dataset.orderTitle!,
      pageWithOption(orderLink.dataset.orderUrl!, choice.dataset.variantId),
      inSentence
    );
    hooks.onPick();

    const next = new Image();
    next.src = choice.dataset.variantSrc!;
    await next.decode().catch(() => {});
    if (picked !== choice) return;
    image.src = next.src;
    image.style.setProperty('--display-height', choice.dataset.variantHeight!);
    hooks.onResize();
    image.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: CHOICE_FADE_MS, easing: EASE_OUT });
  }

  const check = radioButtons(choices, choose);

  return {
    current: () => picked?.dataset.variantId,
    pick(optionId) {
      const choice = choices.find((candidate) => candidate.dataset.variantId === optionId);
      if (choice) choose(choice);
    },
    reset() {
      if (!picked) return;
      picked = null;
      check(null);
      state.textContent = 'none picked yet';
      orderLink.href = firstOrder;
      image.src = image.dataset.originalSrc!;
      image.style.setProperty('--display-height', firstHeight);
    }
  };
}
