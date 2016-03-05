import {
  it,
  iit,
  describe,
  ddescribe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';
import {provide} from 'angular2/core';
import {Countries} from './countries';


describe('Countries Service', () => {

  beforeEachProviders(() => [Countries]);


  it('should ...', inject([Countries], (service:Countries) => {

  }));

});
