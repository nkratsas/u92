import { compilePages } from './src/compilePages.js';
import { SCRAPE_ROOT_URL } from './src/constants.js';

const main = async () => {
    try {
        const url = new URL(SCRAPE_ROOT_URL);
        await compilePages(url);
    } catch (error) {
        console.error('Fatal error during compilation execution:', error);
        process.exit(1);
    }
};

main();
