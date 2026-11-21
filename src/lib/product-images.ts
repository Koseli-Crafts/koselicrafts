// Every file in src/assets/products/ is picked up automatically. Entries may be a
// bare filename ("clock.jpg") or a path ("/products/clock.jpg", which is what
// Pages CMS writes); only the filename is used to look the image up.
const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/products/*.{jpg,jpeg,png,webp,avif,gif}',
  { eager: true }
);

const imagesByFilename = Object.fromEntries(
  Object.entries(imageModules).map(([path, mod]) => [path.split('/').pop()!, mod.default])
);

export const basename = (imageRef: string) => imageRef.split('/').pop()!;

/** The image, or undefined if no file in src/assets/products/ has that name. */
export const productImage = (imageRef: string): ImageMetadata | undefined => imagesByFilename[basename(imageRef)];

export const productImageNames = () => Object.keys(imagesByFilename);
