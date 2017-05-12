import { DemoapplicationPage } from './app.po';

describe('demoapplication App', () => {
  let page: DemoapplicationPage;

  beforeEach(() => {
    page = new DemoapplicationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
