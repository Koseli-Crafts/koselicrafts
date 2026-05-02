import AOS from 'aos';
import Lenis from 'lenis';

export default function initSiteMotion() {
	if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		const lenis = new Lenis({
			duration: 1.15,
			lerp: 0.085,
			smoothWheel: true,
			syncTouch: false
		});

		const raf = (time: number) => {
			lenis.raf(time);
			window.requestAnimationFrame(raf);
		};

		window.requestAnimationFrame(raf);
	}

	AOS.init({
		duration: 900,
		easing: 'ease-out-cubic',
		once: true,
		offset: 18,
		mirror: false
	});
}