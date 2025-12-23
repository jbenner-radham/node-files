import library from '../src/index.js';
import { describe, expect, it } from 'vitest';

describe('library', () => {
  it('is a function', () => {
    expect(library).toBeTypeOf('function');
  });
});
