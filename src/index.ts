import { toString } from './utilities.js';
import fs from 'node:fs';
import path from 'node:path';

export class Path {
  readonly #value: string = '';

  constructor(...paths: (Path | string)[]) {
    this.#value = path.join(...paths.map(toString));
  }

  get directoryName(): string {
    return path.dirname(this.#value);
  }

  get exists(): boolean {
    return fs.existsSync(this.#value);
  }

  isDirectory(): boolean {
    try {
      return fs.statSync(this.#value).isDirectory();
    } catch {
      return false;
    }
  }

  isFile(): boolean {
    try {
      return fs.statSync(this.#value).isFile();
    } catch {
      return false;
    }
  }

  isSymbolicLink(): boolean {
    try {
      return fs.lstatSync(this.#value).isSymbolicLink();
    } catch {
      return false;
    }
  }
}

export default function library(): string {
  return 'Hello world!';
}
