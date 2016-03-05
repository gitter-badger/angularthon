import {describe, it, expect, beforeEachProviders, inject} from 'angular2/testing';
import {HackathoneApp} from '../app/hackathone';

beforeEachProviders(() => [HackathoneApp]);

describe('App: Hackathone', () => {
  it('should have the `defaultMeaning` as 42', inject([HackathoneApp], (app: HackathoneApp) => {
    expect(app.defaultMeaning).toBe(42);
  }));

  describe('#meaningOfLife', () => {
    it('should get the meaning of life', inject([HackathoneApp], (app: HackathoneApp) => {
      expect(app.meaningOfLife()).toBe('The meaning of life is 42');
      expect(app.meaningOfLife(22)).toBe('The meaning of life is 22');
    }));
  });
});

