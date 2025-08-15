// import { FILE_PATHS, ProductType } from '../_consts';
import { FILE_PATHS } from '../_consts';
import { mkdir, mkdirSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import chalk from 'chalk';

const GIT = process.env.VITE_GIT;

interface ShowParams {
  branch: string,
  file: string,
  filePath: string,
  tmpDir: string
}

const fileFrom = ({ branch, file, filePath, tmpDir }: ShowParams) =>{
  const outPath = `${tmpDir}/${file}`;
  const inPath = `${filePath}/${file}`;
  try {
    console.log(chalk.yellowBright(`Ensure your selected branch is current with origin`));
    console.log(chalk.greenBright(`Running git show origin ${branch}:${inPath} > ${outPath}`));

    mkdirSync(tmpDir, { recursive: true });
    execSync(`git show ${ GIT }:${inPath} > ${outPath}`);
  } catch (e) {
    console.log(chalk.yellowBright('File not found or new Language file being called. Writing placeholder'))
    writeFileSync(outPath, JSON.stringify({}))
  }
}

interface ShowLocale {
  languageFile: string,
}


const locale = ({ languageFile }: ShowLocale) => {
  fileFrom({ branch: `${ GIT }`, file: languageFile, tmpDir: FILE_PATHS.TMP, filePath: FILE_PATHS.IMPORT });
}


export const git = {
  show: {
    fileFrom,
    locale
  }
}