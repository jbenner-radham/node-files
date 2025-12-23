import { toString } from './utilities.js';
import fs from 'node:fs';
import path from 'node:path';

export class Path {
  readonly #value: string = '';

  constructor(...paths: (Path | string)[]) {
    this.#value = path.join(...paths.map(toString));
  }

  isDirectory(): boolean {
    try {
      return fs.statSync(this.#value).isDirectory();
    } catch {
      return false;
    }
  }
}

export default function library(): string {
  return 'Hello world!';
}
