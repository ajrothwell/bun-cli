#!/usr/bin/env tsx

import { locale } from './utils/json.ts'
import { git } from './utils/git.ts';
import { folder } from './utils/folder.ts';

import { stringify } from 'csv-stringify/sync';
import { ENGLISH_FILENAME, FILE_PATHS, LANGUAGE_CODE_MAP } from './_consts.ts';

import { translate } from './utils/translate.ts';
import { hash } from './utils/hash.ts';

// import { inflate } from 'flattenjs'

// import fs from 'fs';
import { writeFile } from 'node:fs';
import { parse } from 'path';

type LocaleChangeItem = {
  keyName: string,
  type: 'NEW' | 'CHANGED',
  old: string,
  current: string,
  new: string,
  proposed: string,
  translation: string
}

function inflate(data) {
  var result = {}
  for (var i in data) {
    var keys = i.split('|')
    keys.reduce(function(r, e, j) {
      return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 == j ? data[i] : {}) : [])
    }, result)
  }
  return result
}

/** Trim the language file items to just the keys we care about - the ones that changed in English */
export const reduceToKeys = <T extends { current: Record<string, string>, previous: Record<string, string>}>(keys: { keyName: string}[], language: T) => {
 return keys.reduce((acc, { keyName }) => {
    /** If the key is missing in the current file it requires translation */
    if(!language.current[keyName]){
      return acc;
    };

    acc.source[keyName] ??= language.previous[keyName];
    acc.target[keyName] ??= language.current[keyName];
    return acc;
  }, {
      source: {},
      target: {}
  });
};

/** Driver Function */

/** Diff.English
 * Diff.Languages
 * Send.X
 */
export const loadLanguage = ({ languageFile }) => {
  git.show.locale({ languageFile });
  return {
    current: locale.json.loadFlat({ fileName: languageFile, directory: FILE_PATHS.IMPORT}),
    previous: locale.json.loadFlat({ fileName: languageFile, directory: FILE_PATHS.TMP })
  }
};

export const diff = async() => {
  /** 1) Load -
  *   a) Use git to show the current main (production) file
  *   b) Load the current: (dev, this branch) and previous: (main, production) english file
  */

  folder.remove(FILE_PATHS.TMP);
  const english = loadLanguage({ languageFile: ENGLISH_FILENAME });

  /** 2) Diff the english files for changed values */
  const changed = hash.compare({
    source: english.previous,
    target: english.current,
    predicate: (sourceHash, targetHash) =>  sourceHash !== targetHash
  });
  const changedArray = changed.map(({ keyName }) => {
    return keyName;
  });
  // console.log('changed:', changed, 'changedArray:', changedArray);

  /** 3)  Determine keys missing in each language file & keys that are unchanged*/
  const languageFiles = locale.json.list(FILE_PATHS.IMPORT);
  // console.log('diff, languageFiles:', languageFiles);
  const result = languageFiles.reduce((acc, languageFile) => {
    acc[languageFile] ??= [] as LocaleChangeItem[];
    const language = loadLanguage({ languageFile });

    /** Locate Missing Keys in each language file */
    Object.keys(english.current).forEach(async (keyName) => {

      /** If not present in the current language file, requires translation */
      if(!language.current[keyName]){
        acc[languageFile].push({
          keyName,
          type: 'NEW',
          old: 'N/A',
          current: '',
          new: english.current[keyName],
          proposed: '',
          translation: ''
        })
      }
    });

    /** Pare down language object to the same keys as the diff from previous <> current English */
    const { source, target } = reduceToKeys(changed, language);
    hash.compare({
      source,
      target,
      predicate: (sourceHash, targetHash) => (sourceHash === targetHash)
    }).forEach(async ({ keyName }) => {
      acc[languageFile].push({
        keyName,
        type: 'CHANGED',
        old: english.previous[keyName],
        current: language.current[keyName],
        new: english.current[keyName],
        proposed: '',
        translation: ''
      })
    })

    return acc;
  }, {} as { [key: string]: LocaleChangeItem[] });

  // console.log('result:', result);

  /** ToDo: @ some point, might be nice to decompose/separate the diff from the send, translate, csv steps */
  // const date = new Date();
  // const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

  const languages = Object.keys(result);
  // console.log('languages:', languages);

  const promises = languages.map(async (language) => {
    const [ languageCode ] = language.split('.');
    const translator = translate.to({ languageCode: languageCode as keyof typeof LANGUAGE_CODE_MAP})

    const languageFile = `${languageCode}.json`;
    // console.log('languageFile:', languageFile);
    const fullLanguage = loadLanguage({ languageFile });

    let translated = {};
    for (let item of Object.keys(english.current)) {
      const itemValue = english.current[item];
      if (changedArray.includes(item)) {
        translated[item] = await translator({ text: itemValue });
      } else {
        translated[item] = fullLanguage.current[item];
      }
    }


    const inflated = inflate(translated);
    // console.log('inflated:', inflated);

    const formattedJson = JSON.stringify(inflated, null, 2);
    // console.log('formattedJson:', formattedJson);
    
    // writeFile(`src/i18n/${languageCode}.json`, 'export default'+formattedJson, 'utf8', (err) => {
    writeFile(`i18n/${languageCode}.js`, 'export default'+formattedJson, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
      }
      console.log('File written successfully:', `${languageCode}.js`);
    });

  });
  
}

diff();
