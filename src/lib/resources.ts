import { existsSync, statSync } from 'node:fs';
import resourcesData from '../data/resources.json';
import { SITE_ROOT } from './site';

/** One entry of src/data/resources.json, as Pages CMS writes it. */
interface ResourceEntry {
  title: string;
  description?: string;
  /** "/resources/name.pdf": the PDF lives in public/resources/. Empty means "coming soon". */
  file?: string;
}

export interface Resource {
  title: string;
  description: string;
  /** Missing while the PDF is not ready yet; the page then says "Coming soon". */
  download?: { href: string; filename: string; sizeLabel: string };
}

const PUBLIC_DIR = 'public/resources';

export const RESOURCES_PAGE = `${SITE_ROOT}/resources`;

const basename = (fileRef: string) => fileRef.split('/').pop()!;

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function loadResources(): Resource[] {
  return (resourcesData as ResourceEntry[]).map((entry) => {
    const resource = { title: entry.title, description: entry.description?.trim() ?? '' };
    const filename = basename(entry.file?.trim() ?? '');
    if (!filename) return resource;

    const path = `${PUBLIC_DIR}/${filename}`;
    if (!existsSync(path)) {
      throw new Error(
        `Resource "${entry.title}" points to the file "${entry.file}", but that file is not in ${PUBLIC_DIR}/.`
      );
    }

    return {
      ...resource,
      download: {
        href: `${SITE_ROOT}/resources/${filename}`,
        filename,
        sizeLabel: `PDF · ${formatSize(statSync(path).size)}`
      }
    };
  });
}
