import fs from 'fs';
import yaml from 'yaml';
import { PEOPLE_DIR, PEOPLE_JSON_PATH } from './src/constants.js';

const mapAuthors = () => {
    const authors: { [id: string]: string } = {};

    fs.readdirSync(PEOPLE_DIR).forEach((personFile) => {
        if (personFile === '_index.md') return;

        const cleanedFile = fs
            .readFileSync(`${PEOPLE_DIR}/${personFile}`, 'utf-8')
            .replace(/---/g, '');

        console.log(cleanedFile);

        const personAsJSON = yaml.parse(cleanedFile);
        if (personAsJSON.name) {
            authors[personAsJSON.name.toLowerCase()] = personAsJSON.uuid;
            return;
        }
    });

    fs.writeFileSync(`${PEOPLE_JSON_PATH}`, JSON.stringify(authors, null, 2));
};

mapAuthors();
