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

const Models = { User, Game };
export { Models };