import library from '../src/index.js';
import { Path } from '../src/index.js';
import fs from 'node:fs';
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

  describe('isSymbolicLink', () => {
    it('returns true for symbolic links to files', () => {
      const testDirectory = path.join(tmpdir(), `test-symlink-${Date.now()}`);
      fs.mkdirSync(testDirectory, { recursive: true });
      const targetFile = path.join(testDirectory, 'target.txt');
      const symlinkFile = path.join(testDirectory, 'link.txt');
      fs.writeFileSync(targetFile, 'test');
      fs.symlinkSync(targetFile, symlinkFile);

      try {
        const symlinkPath = new Path(symlinkFile);
        expect(symlinkPath.isSymbolicLink()).toBe(true);
      } finally {
        fs.unlinkSync(symlinkFile);
        fs.unlinkSync(targetFile);
        fs.rmdirSync(testDirectory);
      }
    });

    it('returns true for symbolic links to directories', () => {
      const testDirectory = path.join(tmpdir(), `test-symlink-${Date.now()}`);
      fs.mkdirSync(testDirectory, { recursive: true });
      const targetDirectory = path.join(testDirectory, 'target');
      const symlinkDirectory = path.join(testDirectory, 'link');
      fs.mkdirSync(targetDirectory);
      fs.symlinkSync(targetDirectory, symlinkDirectory);

      try {
        const symlinkPath = new Path(symlinkDirectory);
        expect(symlinkPath.isSymbolicLink()).toBe(true);
      } finally {
        fs.unlinkSync(symlinkDirectory);
        fs.rmdirSync(targetDirectory);
        fs.rmdirSync(testDirectory);
      }
    });

    it('returns false for regular files', () => {
      const filePath = new Path(filename);
      expect(filePath.isSymbolicLink()).toBe(false);
    });

    it('returns false for regular directories', () => {
      const directoryPath = new Path(dirname);
      expect(directoryPath.isSymbolicLink()).toBe(false);
    });

    it('returns false for non-existent paths', () => {
      const nonExistentPath = new Path('/non/existent/path/12345');
      expect(nonExistentPath.isSymbolicLink()).toBe(false);
    });

    it('returns false for empty path (resolves to current directory)', () => {
      const emptyPath = new Path('');
      expect(emptyPath.isSymbolicLink()).toBe(false);
    });

    it('works with path segments to symbolic links', () => {
      const testDirectory = path.join(tmpdir(), `test-symlink-${Date.now()}`);
      fs.mkdirSync(testDirectory, { recursive: true });
      const targetFile = path.join(testDirectory, 'target.txt');
      const symlinkFile = path.join(testDirectory, 'link.txt');
      fs.writeFileSync(targetFile, 'test');
      fs.symlinkSync(targetFile, symlinkFile);

      try {
        const symlinkPathWithSegments = new Path(testDirectory, 'link.txt');
        expect(symlinkPathWithSegments.isSymbolicLink()).toBe(true);
      } finally {
        fs.unlinkSync(symlinkFile);
        fs.unlinkSync(targetFile);
        fs.rmdirSync(testDirectory);
      }
    });
  });

  describe('directoryName', () => {
    it('returns the directory name for file paths', () => {
      const filePath = new Path(filename);
      expect(filePath.directoryName).toBe(dirname);
    });

    it('returns the directory name for directory paths', () => {
      const directoryPath = new Path(dirname);
      expect(directoryPath.directoryName).toBe(path.dirname(dirname));
    });

    it('returns the parent directory for nested file paths', () => {
      const nestedFilePath = new Path(dirname, '..', 'src', 'index.ts');
      expect(nestedFilePath.directoryName).toBe(path.join(dirname, '..', 'src'));
    });

    it('returns "." for files in current directory', () => {
      const currentDirectoryFile = new Path('file.txt');
      expect(currentDirectoryFile.directoryName).toBe('.');
    });

    it('returns the directory name for root paths', () => {
      const rootPath = new Path('/');
      expect(rootPath.directoryName).toBe('/');
    });

    it('returns the directory name for paths with segments', () => {
      const pathWithSegments = new Path('/usr', 'local', 'bin', 'node');
      expect(pathWithSegments.directoryName).toBe(path.join(path.sep, 'usr', 'local', 'bin'));
    });

    it('works with relative paths', () => {
      const relativePath = new Path('..', 'src', 'index.ts');
      const expectedDirectory = path.dirname(path.join('..', 'src', 'index.ts'));
      expect(relativePath.directoryName).toBe(expectedDirectory);
    });

    it('returns "." for empty path', () => {
      const emptyPath = new Path('');
      expect(emptyPath.directoryName).toBe('.');
    });
  });

  describe('exists', () => {
    it('returns true for existing files', () => {
      const filePath = new Path(filename);
      expect(filePath.exists).toBe(true);
    });

    it('returns true for existing directories', () => {
      const directoryPath = new Path(dirname);
      expect(directoryPath.exists).toBe(true);
    });

    it('returns true for root directory', () => {
      const rootPath = new Path('/');
      expect(rootPath.exists).toBe(true);
    });

    it('returns false for non-existent paths', () => {
      const nonExistentPath = new Path('/non/existent/path/12345');
      expect(nonExistentPath.exists).toBe(false);
    });

    it('returns true for empty path (resolves to current directory)', () => {
      const emptyPath = new Path('');
      expect(emptyPath.exists).toBe(true);
    });

    it('returns true for temporary directory', () => {
      const temporaryDirectory = new Path(tmpdir());
      expect(temporaryDirectory.exists).toBe(true);
    });

    it('returns true for relative paths that exist', () => {
      const relativePath = new Path('.');
      expect(relativePath.exists).toBe(true);
    });

    it('returns true for paths with segments that exist', () => {
      const pathWithSegments = new Path(dirname, '..', 'src');
      expect(pathWithSegments.exists).toBe(true);
    });

    it('returns true for symbolic links', () => {
      const testDirectory = path.join(tmpdir(), `test-exists-${Date.now()}`);
      fs.mkdirSync(testDirectory, { recursive: true });
      const targetFile = path.join(testDirectory, 'target.txt');
      const symlinkFile = path.join(testDirectory, 'link.txt');
      fs.writeFileSync(targetFile, 'test');
      fs.symlinkSync(targetFile, symlinkFile);

      try {
        const symlinkPath = new Path(symlinkFile);
        expect(symlinkPath.exists).toBe(true);
      } finally {
        fs.unlinkSync(symlinkFile);
        fs.unlinkSync(targetFile);
        fs.rmdirSync(testDirectory);
      }
    });

    it('returns false for broken symbolic links', () => {
      const testDirectory = path.join(tmpdir(), `test-exists-${Date.now()}`);
      fs.mkdirSync(testDirectory, { recursive: true });
      const symlinkFile = path.join(testDirectory, 'broken-link.txt');
      fs.symlinkSync('/non/existent/target', symlinkFile);

      try {
        const brokenSymlinkPath = new Path(symlinkFile);
        expect(brokenSymlinkPath.exists).toBe(false);
      } finally {
        fs.unlinkSync(symlinkFile);
        fs.rmdirSync(testDirectory);
      }
    });
  });
});
