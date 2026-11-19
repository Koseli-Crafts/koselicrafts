import Lenis from 'lenis';
import initParallax from './parallax';

export default function initSiteMotion() {
	if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		const lenis = new Lenis({
			duration: 1.15,
			lerp: 0.085,
			smoothWheel: true,
			syncTouch: false,
			anchors: true
		});

		const raf = (time: number) => {
			lenis.raf(time);
			window.requestAnimationFrame(raf);
		};

		window.requestAnimationFrame(raf);
	}

	initParallax();
}
