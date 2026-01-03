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

  describe('extension', () => {
    it('returns the extension for files with extensions', () => {
      const filePath = new Path(filename);
      expect(filePath.extension).toBe(path.extname(filename));
    });

    it('returns the extension for TypeScript files', () => {
      const typeScriptFilePath = new Path(dirname, '..', 'src', 'index.ts');
      expect(typeScriptFilePath.extension).toBe('.ts');
    });

    it('returns the extension for JavaScript files', () => {
      const javaScriptFilePath = new Path('script.js');
      expect(javaScriptFilePath.extension).toBe('.js');
    });

    it('returns empty string for files without extensions', () => {
      const fileWithoutExtension = new Path('README');
      expect(fileWithoutExtension.extension).toBe('');
    });

    it('returns empty string for directories', () => {
      const directoryPath = new Path(dirname);
      expect(directoryPath.extension).toBe('');
    });

    it('returns empty string for root directory', () => {
      const rootPath = new Path('/');
      expect(rootPath.extension).toBe('');
    });

    it('returns empty string for empty path', () => {
      const emptyPath = new Path('');
      expect(emptyPath.extension).toBe('');
    });

    it('returns the extension for paths with multiple dots', () => {
      const multiDotPath = new Path('file.min.js');
      expect(multiDotPath.extension).toBe('.js');
    });

    it('returns empty string for hidden files without extensions', () => {
      const hiddenFile = new Path('.gitignore');
      expect(hiddenFile.extension).toBe('');
    });

    it('returns the extension for hidden files with extensions', () => {
      const hiddenFileWithExtension = new Path('.eslintrc.js');
      expect(hiddenFileWithExtension.extension).toBe('.js');
    });

    it('works with path segments', () => {
      const pathWithSegments = new Path('/usr', 'local', 'bin', 'node.exe');
      expect(pathWithSegments.extension).toBe('.exe');
    });

    it('returns "." for paths ending with a dot', () => {
      const pathEndingWithDot = new Path('file.');
      expect(pathEndingWithDot.extension).toBe('.');
    });
  });

  describe('parent', () => {
    it('returns a Path instance for the parent directory of a file', () => {
      const filePath = new Path(filename);
      const parentPath = filePath.parent;
      expect(parentPath).toBeInstanceOf(Path);
      expect(parentPath.directoryName).toBe(path.dirname(dirname));
    });

    it('returns a Path instance for the parent directory of a directory', () => {
      const directoryPath = new Path(dirname);
      const parentPath = directoryPath.parent;
      expect(parentPath).toBeInstanceOf(Path);
      expect(parentPath.directoryName).toBe(path.dirname(path.dirname(dirname)));
    });

    it('returns a Path instance for nested file paths', () => {
      const nestedFilePath = new Path(dirname, '..', 'src', 'index.ts');
      const parentPath = nestedFilePath.parent;
      expect(parentPath).toBeInstanceOf(Path);
      const expectedParentDirectory = path.dirname(path.join(dirname, '..', 'src'));
      expect(parentPath.directoryName).toBe(expectedParentDirectory);
    });

    it('returns a Path instance for files in current directory', () => {
      const currentDirectoryFile = new Path('file.txt');
      const parentPath = currentDirectoryFile.parent;
      expect(parentPath).toBeInstanceOf(Path);
      expect(parentPath.directoryName).toBe('.');
    });

    it('returns a Path instance for root paths', () => {
      const rootPath = new Path('/');
      const parentPath = rootPath.parent;
      expect(parentPath).toBeInstanceOf(Path);
      expect(parentPath.directoryName).toBe('/');
    });

    it('returns a Path instance for paths with segments', () => {
      const pathWithSegments = new Path('/usr', 'local', 'bin', 'node');
      const parentPath = pathWithSegments.parent;
      expect(parentPath).toBeInstanceOf(Path);
      const expectedParentDirectory = path.dirname(path.join(path.sep, 'usr', 'local', 'bin'));
      expect(parentPath.directoryName).toBe(expectedParentDirectory);
    });

    it('works with relative paths', () => {
      const relativePath = new Path('..', 'src', 'index.ts');
      const parentPath = relativePath.parent;
      expect(parentPath).toBeInstanceOf(Path);
      const expectedParentDirectory = path.dirname(
        path.dirname(path.join('..', 'src', 'index.ts'))
      );
      expect(parentPath.directoryName).toBe(expectedParentDirectory);
    });

    it('returns a Path instance for empty path', () => {
      const emptyPath = new Path('');
      const parentPath = emptyPath.parent;
      expect(parentPath).toBeInstanceOf(Path);
      expect(parentPath.directoryName).toBe('.');
    });

    it('allows chaining parent calls', () => {
      const filePath = new Path(dirname, '..', 'src', 'index.ts');
      const parentPath = filePath.parent;
      const grandparentPath = parentPath.parent;
      expect(grandparentPath).toBeInstanceOf(Path);
      const expectedGrandparent = path.dirname(
        path.dirname(path.join(dirname, '..', 'src'))
      );
      expect(grandparentPath.directoryName).toBe(expectedGrandparent);
    });
  });

  describe('contents', () => {
    it('returns the contents of an existing file', () => {
      const testDirectory = path.join(tmpdir(), `test-contents-${Date.now()}`);
      fs.mkdirSync(testDirectory, { recursive: true });
      const testFile = path.join(testDirectory, 'test.txt');
      fs.writeFileSync(testFile, 'Hello, World!');

      try {
        const filePath = new Path(testFile);
        expect(filePath.contents()).toBe('Hello, World!');
      } finally {
        fs.unlinkSync(testFile);
        fs.rmdirSync(testDirectory);
      }
    });

    it('returns contents with multiple lines', () => {
      const testDirectory = path.join(tmpdir(), `test-contents-${Date.now()}`);
      fs.mkdirSync(testDirectory, { recursive: true });
      const testFile = path.join(testDirectory, 'multiline.txt');
      const multilineContent = 'Line 1\nLine 2\nLine 3';
      fs.writeFileSync(testFile, multilineContent);

      try {
        const filePath = new Path(testFile);
        expect(filePath.contents()).toBe(multilineContent);
      } finally {
        fs.unlinkSync(testFile);
        fs.rmdirSync(testDirectory);
      }
    });

    it('returns empty string for empty files', () => {
      const testDirectory = path.join(tmpdir(), `test-contents-${Date.now()}`);
      fs.mkdirSync(testDirectory, { recursive: true });
      const testFile = path.join(testDirectory, 'empty.txt');
      fs.writeFileSync(testFile, '');

      try {
        const filePath = new Path(testFile);
        expect(filePath.contents()).toBe('');
      } finally {
        fs.unlinkSync(testFile);
        fs.rmdirSync(testDirectory);
      }
    });

    it('works with path segments', () => {
      const testDirectory = path.join(tmpdir(), `test-contents-${Date.now()}`);
      fs.mkdirSync(testDirectory, { recursive: true });
      const testFile = path.join(testDirectory, 'test.txt');
      fs.writeFileSync(testFile, 'path segments test');

      try {
        const filePath = new Path(testDirectory, 'test.txt');
        expect(filePath.contents()).toBe('path segments test');
      } finally {
        fs.unlinkSync(testFile);
        fs.rmdirSync(testDirectory);
      }
    });

    it('throws an error for non-existent files', () => {
      const nonExistentPath = new Path('/non/existent/path/12345.txt');
      expect(() => nonExistentPath.contents()).toThrow();
    });

    it('returns directory entries for directories', () => {
      const testDirectory = path.join(tmpdir(), `test-contents-${Date.now()}`);
      fs.mkdirSync(testDirectory, { recursive: true });
      const testFile = path.join(testDirectory, 'file.txt');
      const subDirectory = path.join(testDirectory, 'subdir');
      fs.writeFileSync(testFile, 'test');
      fs.mkdirSync(subDirectory);

      try {
        const directoryPath = new Path(testDirectory);
        const contents = directoryPath.contents();
        expect(Array.isArray(contents)).toBe(true);
        expect(contents).toHaveLength(2);
        const names = (contents as fs.Dirent[]).map(entry => entry.name);
        expect(names).toContain('file.txt');
        expect(names).toContain('subdir');
      } finally {
        fs.rmdirSync(subDirectory);
        fs.unlinkSync(testFile);
        fs.rmdirSync(testDirectory);
      }
    });

    it('returns Dirent objects with correct types for directory contents', () => {
      const testDirectory = path.join(tmpdir(), `test-contents-${Date.now()}`);
      fs.mkdirSync(testDirectory, { recursive: true });
      const testFile = path.join(testDirectory, 'file.txt');
      const subDirectory = path.join(testDirectory, 'subdir');
      fs.writeFileSync(testFile, 'test');
      fs.mkdirSync(subDirectory);

      try {
        const directoryPath = new Path(testDirectory);
        const contents = directoryPath.contents() as fs.Dirent[];
        const fileEntry = contents.find(entry => entry.name === 'file.txt');
        const directoryEntry = contents.find(entry => entry.name === 'subdir');
        expect(fileEntry?.isFile()).toBe(true);
        expect(directoryEntry?.isDirectory()).toBe(true);
      } finally {
        fs.rmdirSync(subDirectory);
        fs.unlinkSync(testFile);
        fs.rmdirSync(testDirectory);
      }
    });

    it('returns empty array for empty directories', () => {
      const testDirectory = path.join(tmpdir(), `test-contents-${Date.now()}`);
      fs.mkdirSync(testDirectory, { recursive: true });

      try {
        const directoryPath = new Path(testDirectory);
        const contents = directoryPath.contents();
        expect(Array.isArray(contents)).toBe(true);
        expect(contents).toHaveLength(0);
      } finally {
        fs.rmdirSync(testDirectory);
      }
    });

    it('reads the current test file correctly', () => {
      const testFilePath = new Path(filename);
      const contents = testFilePath.contents();
      expect(contents).toContain("describe('contents'");
    });
  });
});
