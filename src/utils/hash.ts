import murmurhash from "murmurhash";

interface HashCompareParams <Source, Target>{
  source: Source,
  target: Target,
  predicate: (sourceHash: number, targetHash: number) => boolean
}

export const compare = <S extends Record<string, any>, T extends Record<string, any>>({ source, target, predicate }: HashCompareParams<S,T>) => {
  return Object.entries(source).reduce((acc, [sourceKey]) => {
    const sourceHash = murmurhash.v3(source[sourceKey] || '');
    const targetHash = murmurhash.v3(target[sourceKey] || '');

        if(predicate(sourceHash, targetHash)) {
          acc.push({ keyName: sourceKey })
        }

    return acc;
  }, [] as { keyName: string }[])
}

export const hash = {
  compare
}