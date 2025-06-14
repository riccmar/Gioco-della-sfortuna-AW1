import dayjs from 'dayjs';

function User(id, name, email) {
  this.id = id;
  this.name = name;
  this.email = email;
}

function Game(id, date, win) {
  this.id = id;
  this.date = dayjs(date);
  this.win = win;
}

function Card(id, name, path, rate) {
  this.id = id;
  this.name = name;
  this.path = path;
  this.rate = rate;
}

const Models = { User, Game, Card };
export { Models };