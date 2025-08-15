import { TranslateTextCommand, ListLanguagesCommand, Brevity, Formality, Profanity } from '@aws-sdk/client-translate';
import { client, LANGUAGE_CODE_MAP } from '../_consts';
import chalk from 'chalk';


const supportedLanguages = async () => {
  const response = await client.translate.send(new ListLanguagesCommand());
  console.dir(response);
};

interface TargetLang { languageCode: string & keyof typeof LANGUAGE_CODE_MAP };
interface InvokeParams { text: string };

/** Setup Configuration map for Formality & etc.  */
const to = ({ languageCode }: TargetLang) => async ({ text }: InvokeParams) => {
  if(!LANGUAGE_CODE_MAP[languageCode]) {
    console.log(chalk.yellowBright(`${languageCode} is not supported by AWS translate or a mapping does not exist in consts.`));
    return ''
  };

  const params = {
    Text: text,
    SourceLanguageCode: LANGUAGE_CODE_MAP.en,
    TargetLanguageCode: LANGUAGE_CODE_MAP[languageCode],
    Settings: {
      // Formality: Formality.FORMAL,
      Profanity: Profanity.MASK,
      // Brevity: Brevity.ON
    }
   };

  const response = await client.translate.send(new TranslateTextCommand(params));
  return response.TranslatedText || '';
}

export const translate = {
  supportedLanguages,
  to
}
