[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/uNTgnFHD)
# Exam #1: "Gioco della Sfortuna"
## Student: s342227 MARCONI RICCARDO

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- POST `/api/something`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

- Table `users`
  | Field    | Type    |
  | -------- | ------- |
  | idU      | integer |
  | name     | text    |
  | email    | text    |
  | password | text    |
  | salt     | text    |

- Table `Card`
  | Field | Type    |
  | ----- | ------- |
  | idC   | integer |
  | name  | text    |
  | path  | text    |
  | index | integer |

- Table `Game`
  | Field  | Type    |
  | ------ | ------- |
  | idG    | integer |
  | date   | text    |
  | win    | integer |
  | userId | integer |

- Table `Round`
  | Field  | Type    |
  | ------ | ------- |
  | idR    | integer |
  | number | integer |
  | start  | text    |
  | end    | text    |
  | win    | integer |
  | cardId | integer |
  | gameId | integer |
  | userId | integer |

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- riccardo.marconi@polito.it, password
- elon.musk@polito.it, password
