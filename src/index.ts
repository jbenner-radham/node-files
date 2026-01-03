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

  get extension(): string {
    return path.extname(this.#value);
  }

  get parentDirectory(): Path {
    // return new Path(path.dirname(this.#value));
    return new Path(this.directoryName);
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

  contents(): string {
    return fs.readFileSync(this.#value, 'utf-8');
  }
}

export default function library(): string {
  return 'Hello world!';
}
