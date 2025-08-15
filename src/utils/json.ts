import assert from 'assert';
import chalk from 'chalk';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, normalize, resolve } from 'node:path';

export const keyConcat = (acc: Record<string, any>, [parentKey, value]) => {

  if(typeof value === 'string'){
    acc[parentKey] ??= value;
    return acc;
  }

  Object.entries(value).forEach(([childKey, childValue]) => {
    return keyConcat(acc, [`${parentKey}|${childKey}`, childValue])
  })

  return acc;
}

export const flatKeys = (file: Record<string, any>, acc = {}) => {
  return Object.entries(file)
  .reduce(keyConcat, acc)
};

interface LoadFileParams {
  directory: string,
  fileName: string
};

const loadFlat = ({ directory, fileName }: LoadFileParams): Record<string, any> => {
  const filePath = join(directory, fileName);
  assert(existsSync(filePath), `Invalid Path: ${resolve(filePath)}`);

  const text = readFileSync(filePath, { encoding: 'utf-8'});
  const parsed =  JSON.parse(text);
  // console.log('parsed:', parsed);
  return flatKeys(parsed);
};

const list = (directory: string) => {
  return readdirSync(normalize(directory)).filter((file) => file !== 'en.json' && file.includes('.js'));
}

export const locale = {
  json: {
    loadFlat,
    list
  }
}