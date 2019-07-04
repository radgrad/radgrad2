import * as fs from 'fs';
// const fs = require('fs');
import * as inquirer from 'inquirer';
// const inquirer = require('inquirer');
// const _ = require('lodash');
// const moment = require('moment');

async function convertRadGrad1DatabaseDumpToRadGrad2() {
  const questions = [
    {
      name: 'radgrad1',
      type: 'input',
      message: 'Enter the RadGrad1 database dump file name',
      validate: value => (value.length ? true : 'Please enter the database dump file name'),
    },
  ];
  const userParams = await inquirer.prompt(questions);
  // console.log(userParams.radgrad1);
  const data = fs.readFileSync(userParams.radgrad1);
  const json = JSON.parse(data.toString());
  console.log(json);
}

/**
 * Run the conversion.
 */
convertRadGrad1DatabaseDumpToRadGrad2();
