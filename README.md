[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/uNTgnFHD)
# Exam #1: "Gioco della Sfortuna"
## Student: s342227 MARCONI RICCARDO

## React Client Application Routes

- Route `/`: Pagina Home dove è possibile iniziare una nuova partita e leggere le istruzioni del gioco.
- Route `/match/:gamedId`: Pagina in cui si svolge la partita round per round. Un utente non loggato potrà giocare una partita di un solo round (demo).
- Route `/login`: Pagina contente il form di login.
- Route `/profile`: Pagina in cui un utente loggato può controllare il proprio profilo e la cronologia delle partite giocate.

## API Server

- POST `/api/login`
  - Descrizione: Autenticazione dell'utente e creazione di una nuova sessione.

  - Request parameters: `None`
  - Request body:
    ```json
    {
      "username": "test@polito.it",
      "password": "password"
    }
    ```

  - Response: 
    - `201 Created`: Successo, ritorna un Utente in formato JSON (vedi esempio sotto)
    - `401 Unauthorized`: Credenziali errate
    - `500 Internal Server Error`: Errore del server
  - Response body:
    ```json
    {
      "id": 1,
      "name": "Test",
      "email": "test@polito.it"
    }
    ```

- GET `/api/session/current`
  - Descrizione: Recupera le informazioni della sessione corrente
  
  - Request parameters: `None`
  - Request body: `None`

  - Response:
    - `200 OK`: Successo, ritorna le informazioni della sessione in formato JSON (vedi esempio sotto)
    - `401 Unauthorized`: Nessun utente loggato
    - `500 Internal Server Error`: Errore del server
  - Response body:
    ```json
    {
      "id": 1,
      "name": "Test",
      "email": "test@polito.it"
    }
    ```

- DELETE `/api/logout`
  - Descrizione: Effettua il logout dell'utente corrente, terminando la sessione.

  - Request parameters: `None`
  - Request body: `None`

  - Response:
    - `200 OK`: Successo, sessione terminata
    - `401 Unauthorized`: Nessun utente loggato
    - `500 Internal Server Error`: Errore del server
  - Response body: `None`

- POST `/api/games/new`
  - Descrizione: Crea una nuova partita

  - Request parameters: `None`
  - Request body: `None`

  - Response:
    - `201 Created`: Successo, ritorna l'ID della nuova partita in formato JSON (vedi esempio sotto)
    - `500 Internal Server Error`: Errore del server
  - Response body:
    ```json
    {
      "gameId": 1
    }
    ```
  
- POST `/api/games/:gameId/rounds/new`
  - Descrizione: Inizia un nuovo round per la partita specificata

  - Request parameters: `gameId`, ID della partita
  - Request body: `None`

  - Response:
    - `201 Created`: Successo, ritorna l'ID del nuovo round in formato JSON (vedi esempio sotto)
    - `401 Unauthorized`: Utente non loggato inizia un nuovo round oltre il primo
    - `400 Bad Request`: Utente inizia un nuovo round oltre il quinto
    - `500 Internal Server Error`: Errore del server
  - Response body:
    ```json
    {
      "roundId": 1
    }
    ```

- GET `/api/games/:gameId/rounds/current`
  - Descrizione: Recupera l'ID del round corrente (l'ultimo) della partita specificata

  - Request parameters: `gameId`, ID della partita
  - Request body: `None`

  - Response:
    - `200 OK`: Successo, ritorna l'ID del round corrente in formato JSON (vedi esempio sotto)
    - `500 Internal Server Error`: Errore del server
  - Response body:
    ```json
    {
      "roundId": 1
    }
    ```


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

- `NavHeader` (in `NavHeader.jsx`): definisce l'header delle pagine, contiene il logo del gioco, i link per accedere alle pagine di login e profilo, e il bottone per il logout.
- `Footer` (in `Footer.jsx`): definisce il footer delle pagine.
- `Home` (in `Home.jsx`): definisce l'home page del gioco. Costituita da `HomeIntro`, in cui è presente un bottone per iniziare una nuova partita, e `HomeRules`, in cui sono presenti le istruzioni del gioco.
- `Game` (in `Game.jsx`): definisce la pagina di gioco. Costituita da due parti: a sinistra è presente il componente `OwnedCards` per mostrare le carte possedute dal giocatore, mentre a destra sono presenti dinamicamente diversi componenti a seconda dello stato del gioco - `StartRound` per avviare un nuovo round, `Choices` per selezionare l'intervallo di sfortuna della carta da indovinare, oppure `EndRound` per concludere la partita e tornare alla home o iniziare una nuova partita.
- `ChoiceForm` (in `ChoiceForm.jsx`): definisce il form per la scelta dell'intervallo di sfortuna della carta da indovinare.
- `LoginForm` (in `LoginForm.jsx`): definisce il form per il login dell'utente.
- `Profile` (in `Profile.jsx`): definisce la pagina del profilo dell'utente. Contiene il componente `MatchList` che mostra la cronologia delle partite giocate, con la possibilità di visualizzare i dettagli di ogni partita.
- `NotFound` (in `NotFound.jsx`): definisce la pagina di errore 404, che viene mostrata quando l'utente cerca di accedere a una route inesistente.

## Screenshot

![GamePage](./img/gamePage.png)
![ProfilePage](./img/profilePage.png)

## Users Credentials

- riccardo.marconi@polito.it, password
- elon.musk@polito.it, password