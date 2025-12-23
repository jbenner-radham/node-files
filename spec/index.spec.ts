import library from '../src/index.js';
import { Path } from '../src/index.js';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

describe('library', () => {
  it('is a function', () => {
    expect(library).toBeTypeOf('function');
  });
});

describe('Path', () => {
  describe('isDirectory', () => {
    it('returns true for existing directories', () => {
      const directoryPath = new Path(dirname);
      expect(directoryPath.isDirectory()).toBe(true);
    });

    it('returns true for root directory', () => {
      const rootPath = new Path('/');
      expect(rootPath.isDirectory()).toBe(true);
    });

    it('returns false for existing files', () => {
      const filePath = new Path(filename);
      expect(filePath.isDirectory()).toBe(false);
    });

    it('returns false for non-existent paths', () => {
      const nonExistentPath = new Path('/non/existent/path/12345');
      expect(nonExistentPath.isDirectory()).toBe(false);
    });

    it('returns true for empty path (resolves to current directory)', () => {
      const emptyPath = new Path('');
      expect(emptyPath.isDirectory()).toBe(true);
    });

    it('works with temporary directory', () => {
      const temporaryDirectory = new Path(tmpdir());
      expect(temporaryDirectory.isDirectory()).toBe(true);
    });

    it('works with relative paths', () => {
      const relativePath = new Path('.');
      expect(relativePath.isDirectory()).toBe(true);
    });

    it('works with path segments', () => {
      const pathWithSegments = new Path(dirname, '..', 'src');
      expect(pathWithSegments.isDirectory()).toBe(true);
    });
  });

  describe('isFile', () => {
    it('returns true for existing files', () => {
      const filePath = new Path(filename);
      expect(filePath.isFile()).toBe(true);
    });

    it('returns false for existing directories', () => {
      const directoryPath = new Path(dirname);
      expect(directoryPath.isFile()).toBe(false);
    });

    it('returns false for root directory', () => {
      const rootPath = new Path('/');
      expect(rootPath.isFile()).toBe(false);
    });

    it('returns false for non-existent paths', () => {
      const nonExistentPath = new Path('/non/existent/path/12345');
      expect(nonExistentPath.isFile()).toBe(false);
    });

    it('returns false for empty path (resolves to current directory)', () => {
      const emptyPath = new Path('');
      expect(emptyPath.isFile()).toBe(false);
    });

    it('works with path segments to files', () => {
      const filePathWithSegments = new Path(dirname, '..', 'src', 'index.ts');
      expect(filePathWithSegments.isFile()).toBe(true);
    });

    it('works with path segments to directories', () => {
      const directoryPathWithSegments = new Path(dirname, '..', 'src');
      expect(directoryPathWithSegments.isFile()).toBe(false);
    });
  });
});
