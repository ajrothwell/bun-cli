import { rmSync } from "fs";

const remove = (directory: string) => {
  try {
    rmSync(directory, { recursive: true, force: true })
  } catch ({ message }) {
    console.error(message);
    console.log(`Unable to remove ${directory}`)
  }
};

export const folder = {
  remove
}