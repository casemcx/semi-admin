import { describe, expect, it } from '@rstest/core';

import { isIntelligentRenderType } from '../utils';

describe('ProTable utils', () => {
  describe('isIntelligentRenderType', () => {
    it('should return false for undefined type', () => {
      expect(isIntelligentRenderType(undefined)).toBe(false);
    });

    it('should return true for "image" type', () => {
      expect(isIntelligentRenderType('image')).toBe(true);
    });

    it('should return true for "upload" type', () => {
      expect(isIntelligentRenderType('upload')).toBe(true);
    });

    it('should return true for "markdown" type', () => {
      expect(isIntelligentRenderType('markdown')).toBe(true);
    });

    it('should return true for "date" type', () => {
      expect(isIntelligentRenderType('date')).toBe(true);
    });

    it('should return true for "datetime" type', () => {
      expect(isIntelligentRenderType('datetime')).toBe(true);
    });

    it('should return true for "select" type', () => {
      expect(isIntelligentRenderType('select')).toBe(true);
    });

    it('should return true for "switch" type', () => {
      expect(isIntelligentRenderType('switch')).toBe(true);
    });

    it('should return false for "input" type', () => {
      expect(isIntelligentRenderType('input')).toBe(false);
    });

    it('should return false for "textarea" type', () => {
      expect(isIntelligentRenderType('textarea')).toBe(false);
    });

    it('should return false for "number" type', () => {
      expect(isIntelligentRenderType('number')).toBe(false);
    });

    it('should return false for "password" type', () => {
      expect(isIntelligentRenderType('password')).toBe(false);
    });

    it('should return false for "checkbox" type', () => {
      expect(isIntelligentRenderType('checkbox')).toBe(false);
    });

    it('should return false for "radio" type', () => {
      expect(isIntelligentRenderType('radio')).toBe(false);
    });

    it('should return false for "cascader" type', () => {
      expect(isIntelligentRenderType('cascader')).toBe(false);
    });

    it('should return false for "treeSelect" type', () => {
      expect(isIntelligentRenderType('treeSelect')).toBe(false);
    });
  });
});
