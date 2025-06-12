import dayjs from 'dayjs';

function User(id, name, email) {
  this.id = id;
  this.name = name;
  this.email = email;
}

function Game(id, date, win, userId ) {
  this.id = id;
  this.date = dayjs(date);
  this.win = win;
  this.userId = userId;
}

function Card(id, name, path, rate) {
  this.id = id;
  this.name = name;
  this.path = path;
  this.rate = rate;
}

function HiddenCard(id, name, image) {
  this.id = id;
  this.name = name;
  this.image = image;
}

const Models = { User, Game, Card, HiddenCard };
export { Models };