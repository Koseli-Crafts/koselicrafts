import type { APIRoute, GetStaticPaths } from 'astro';
import { loadCatalog } from '../../lib/catalog';
import { FIRST_THEME } from '../../lib/themes';
import { shareImage } from '../../lib/share-image';
import { SITE_SHARE_IMAGE } from '../../lib/site';

export const getStaticPaths = (async () => {
  const products = await loadCatalog();
  return [
    { params: { name: SITE_SHARE_IMAGE }, props: { file: FIRST_THEME.imageFile, background: FIRST_THEME.background } },
    ...products.map((product) => ({
      params: { name: product.id },
      props: { file: product.imageFile, background: product.themeBackground }
    }))
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await shareImage(props.file, props.background)), {
    headers: { 'Content-Type': 'image/jpeg' }
  });
