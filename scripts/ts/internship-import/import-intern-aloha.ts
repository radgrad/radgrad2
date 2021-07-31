import { program } from 'commander';
import { InternAlohaUrls } from './InternAlohaUrls';

const fetch = require('node-fetch');

async function importInternAloha(url) {
  const response = await fetch(url);
  const internships = await response.json();
  console.log(internships.length);
}

program
  .action(() => importInternAloha(InternAlohaUrls.ziprecruiter));

program.parse(process.argv);
