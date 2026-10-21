import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const MAX_CALLS_PER_SECOND = 50;
export const THROTTLE_DELAY_MS = 1000 / MAX_CALLS_PER_SECOND;
export const SCRAPE_ROOT_URL = 'https://u92themoose.com/wireless/page/1';
export const ASSET_DOMAIN = 'https://u92themoose.com';
export const MAX_RETRIES = 1;
// MAX_PAGES_TO_COMPILE = -1 will compile all pages
export const MAX_PAGES_TO_COMPILE = -1;
export const TMP_DIR = path.resolve(__dirname, '../tmp/');
export const ARTICLE_PARTS_DIR = path.resolve(TMP_DIR, 'articleParts/');
export const OUTPUT_DIR = path.resolve(TMP_DIR, 'output/');
export const IMAGES_DIR = path.join(TMP_DIR, 'images');
export const IMAGES_MAP_FILE_PATH = path.join(TMP_DIR, 'images_map.json');
export const HUGO_OUTPUT_DIR = path.join(OUTPUT_DIR, 'test/');
export const ROOT_DIR = path.join(__dirname, '../../');
export const PEOPLE_DIR = path.join(ROOT_DIR, '/content/people/');
export const PEOPLE_JSON_PATH = path.join(TMP_DIR, 'people.json');
