import { Angular4RestaurantPage } from './app.po';

describe('angular4-restaurant App', () => {
  let page: Angular4RestaurantPage;

  beforeEach(() => {
    page = new Angular4RestaurantPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
