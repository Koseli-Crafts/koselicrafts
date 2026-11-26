import Lenis from 'lenis';
import initParallax from './parallax';

export default function initSiteMotion() {
	let lenis: Lenis | null = null;

	if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		lenis = new Lenis({
			duration: 1.15,
			lerp: 0.085,
			smoothWheel: true,
			syncTouch: false,
			anchors: true
		});

		const raf = (time: number) => {
			lenis!.raf(time);
			window.requestAnimationFrame(raf);
		};

		window.requestAnimationFrame(raf);
	}

	initParallax();
	initBackToTop(lenis);
}

function initBackToTop(lenis: Lenis | null) {
	const button = document.querySelector<HTMLButtonElement>('[data-back-to-top]');
	if (!button) return;
	button.hidden = false;

	const update = () => button.classList.toggle('is-shown', window.scrollY > window.innerHeight);
	window.addEventListener('scroll', update, { passive: true });
	update();

	button.addEventListener('click', () => {
		if (lenis) lenis.scrollTo(0);
		else window.scrollTo(0, 0);
	});
}
