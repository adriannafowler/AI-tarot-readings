# APIs

- This project uses Django on the backend, and a PostgreSQL database. User must be signed in for all urls except the landing page, sign-up, and login pages.

## Tarot API Endpoints

|    Action                     | Method | URL                                               |
|-------------------------------|--------|---------------------------------------------------|
| List All Decks                | GET    | `/api/decks/`                                     |
| Create a Deck                 | POST   | `/api/decks/`                                     |
| Deck Detail                   | GET    | `/api/decks/<int:id>/`                            |
| Update Deck                   | PUT    | `/api/decks/<int:id>/`                            |
| Delete Deck                   | DELETE | `/api/decks/<int:id>/`                            |
| List All Cards in Deck        | GET    | `/api/decks/<int:id>/cards/`                      |
| Create a Card in Deck         | POST   | `/api/decks/<int:id>/cards/`                      |
| Card Detail                   | GET    | `/api/decks/<int:deck_id>/cards/<int:card_id>/`   |
| Update Card                   | PUT    | `/api/decks/<int:deck_id>/cards/<int:card_id>/`   |
| Delete Card                   | DELETE | `/api/decks/<int:deck_id>/cards/<int:card_id>/`   |
| List All Readings             | GET    | `/api/readings/`                                  |
| Create a Reading              | POST   | `/api/readings/`                                  |
| Reading Detail                | GET    | `/api/readings/<int:id>/`                         |
| Update Reading Title          | PATCH  | `/api/readings/<int:id>/`                         |
| Delete Reading                | DELETE | `/api/readings/<int:id>/`                         |
| User Login                    | POST   | `/login/`                                         |
| User Logout                   | POST   | `/logout/`                                        |
| User Sign Up                  | POST   | `/signup/`                                        |
| Obtain JWT Token              | POST   | `/api/token/`                                     |
| Refresh JWT Token             | POST   | `/api/token/refresh/`                             |


### List All Decks

- List All Decks: returns list of Decks associated with current user

Request:
 - Method: GET
 - URL: `/api/decks/`
 - Headers:
  - Authorization: Bearer <JWT Token>
  - Accept: application/json

Response body:
```
{
  "decks": [
    {
      "id": integer,
      "name": string,
      "exclude_negative": boolean,
      "img_url": string,
      "user": integer - foreign key
    }
  ]
}
```

###  Create a Deck, Update Deck

- Create a Deck: returns newly created deck
- Update Deck: returns deck just updated

Request:
 - Method: POST, PUT
 - URL - POST: `/api/decks/`
 - URL - PUT: `/api/decks/<int:id>/`
 - Headers:
  - Authorization: Bearer <JWT Token>
  - Accept: application/json

Request body:
```
{
  "name": string,
  "exclude_negative": boolean,
  "img_url": string,
  "user": integer - foreign key
}
```

Response body:
```
{
  "name": string,
  "exclude_negative": boolean,
  "img_url": string,
  "user": integer - foreign key
}
```

###  Deck Detail

- Deck Detail: returns individual deck that belongs to current user and whose id matches user selection

Request:
 - Method: GET
 - URL: `/api/decks/<int:id>/`
 - Headers:
  - Authorization: Bearer <JWT Token>
  - Accept: application/json

Response body:
```
{
  "deck": {
    "id": integer,
    "name": string,
    "exclude_negative": boolean,
    "img_url": string,
    "user": integer - foreign key
  }
}
```

### Delete a Deck

- Deletes selected Deck

Request:
 - Method: DELETE
 - URL: `/api/decks/<int:id>/`
 - Headers:
  - Authorization: Bearer <JWT Token>
  - Accept: application/json

Response body:
```
{
  "deleted": boolean
}
```

### List All Cards in Deck

- Lists all cards in selected deck

Request:
 - Method: GET
 - URL: `/api/decks/<int:id>/cards/`
 - Headers:
  - Authorization: Bearer <JWT Token>
  - Accept: application/json

Response body:
```
{
  "cards": [
    {
      "id": integer,
      "name": string,
      "image_url": string,
      "description": text field,
      "is_negative": boolean,
      "deck": integer - foreign key
    }
  ]
}
```

###  Create a Card, Update a Card

- Create a Card: returns newly created card
- Update Card: returns card just updated

Request:
 - Method: POST, PUT
 - URL - POST: `/api/decks/<int:id>/cards/`
 - URL - PUT: `/api/decks/<int:deck_id>/cards/<int:card_id>/`
 - Headers:
  - Authorization: Bearer <JWT Token>
  - Accept: application/json

Request body:
```
{
  "id": integer,
  "name": string,
  "image_url": string,
  "description": text field,
  "is_negative": boolean,
  "deck": integer - foreign key
}
```

Response body:
```
{
  "id": integer,
  "name": string,
  "image_url": string,
  "description": text field,
  "is_negative": boolean,
  "deck": integer - foreign key
}
```

###  Card Detail

- Card Detail: returns individual card that belongs to current user and whose id matches selection

Request:
 - Method: GET
 - URL: `/api/decks/<int:deck_id>/cards/<int:card_id>/`
 - Headers:
  - Authorization: Bearer <JWT Token>
  - Accept: application/json

Response body:
```
{
  "id": integer,
  "name": string,
  "image_url": string,
  "description": text field,
  "is_negative": boolean,
  "deck": integer - foreign key
}
```

### Delete a Card

- Deletes selected Card

Request:
 - Method: DELETE
 - URL: `/api/decks/<int:deck_id>/cards/<int:card_id>/`
 - Headers:
  - Authorization: Bearer <JWT Token>
  - Accept: application/json

Response body:
```
{
  "deleted": boolean
}
```

### List All Readings

- List All Readings: returns list of readings associated with current user

Request:
 - Method: GET
 - URL: `/api/readings/`
 - Headers:
  - Authorization: Bearer <JWT Token>
  - Accept: application/json

Response body:
```
{
  "readings": [
    {
      "id": integer,
      "time_stamp": datetime string,
      "title": string(Optional, default - null),
      "reading": text field,
      "user": integer - foreign key,
      "cards": list of integers - many to many
    }
  ]
}
```

###  Create a Reading

- Create a Reading: returns newly created reading

Request:
 - Method: POST
 - URL: `/api/readings/`
 - Headers:
  - Authorization: Bearer <JWT Token>
  - Accept: application/json

Request body:
```
{
  "deck_id": integer
}
```

Response body:
```
{
  "id": integer,
  "time_stamp": datetime string,
  "title": string(Optional, default - null),
  "reading": text field,
  "user": integer - foreign key,
  "cards": list of integers - many to many
}

```
###  Reading Detail

- Reading Detail: returns individual reading that belongs to current user and whose id matches selection

Request:
 - Method: GET
 - URL: `/api/readings/<int:id>/`
 - Headers:
  - Authorization: Bearer <JWT Token>
  - Accept: application/json

Response body:
```
{
  "id": integer,
  "time_stamp": datetime string,
  "title": string(Optional, default - null),
  "reading": text field,
  "user": integer - foreign key,
  "cards": list of integers - many to many
}
```

###  Update Reading Title

- Update Reading Title: returns newly updated Reading

Request:
 - Method: PATCH
 - URL - PUT: `/api/readings/<int:id>/`
 - Headers:
  - Authorization: Bearer <JWT Token>
  - Accept: application/json

Request body:
```
{
  "title": string
}
```

Response body:
```
{
  "id": integer,
  "time_stamp": datetime string,
  "title": string(Optional, default - null),
  "reading": text field,
  "user": integer - foreign key,
  "cards": list of integers - many to many
}
```

### Delete a Reading

- Deletes selected Reading

Request:
 - Method: DELETE
 - URL: `/api/readings/<int:id>/`
 - Headers:
  - Authorization: Bearer <JWT Token>
  - Accept: application/json

Response body:
```
{
  "deleted": boolean
}
```
###  User Login

- Logs in user using username and password

Request:
 - Method: POST
 - URL: `/login/`
 - Headers:
  - Accept: application/json

Request body:
```
{
  "username": string,
  "password": string
}
```

Response body:
```
{
  "refresh": string - Refresh Token,
  "access": string - Access Token,
  "user": {
    "id": integer,
    "first_name": string,
    "last_name": string,
    "username": string,
    "email": string
  }
}
```

###  User Logout

- Logs out user

Request:
 - Method: POST
 - URL: `/logout/`
 - Headers:
  - Authorization: Bearer <JWT Token>
  - Accept: application/json

Response:
  HTTP Response 204 - Successful, No Content

###  User Sign Up

- Creates an account for user, does not log them in

Request:
 - Method: POST
 - URL: `/signup/`
 - Headers:
  - Accept: application/json

Request body:
```
{
  "first_name": string,
  "last_name": string,
  "username": string - Unique,
  "email": string - Unique,
  "password": string
}
```

Response body:
```
{
  "refresh": string - refresh Token,
  "access": string - access Token,
  "user": {
    "id": integer,
    "first_name": string,
    "last_name": string,
    "username": string,
    "email": string
  }
}
```

###  Obtain JWT Token

Request:
 - Method: POST
 - URL: `/api/token/`
 - Headers:
  - Accept: application/json

Request body:
```
{
  "username": string,
  "password": string
}
```

Response body:
```
{
  "refresh": string - refresh Token,
  "access": string - access Token
}
```

###  Refresh JWT Token

Request:
 - Method: POST
 - URL: `/api/token/refresh/`
 - Headers:
  - Accept: application/json

Request body:
```
{
  "refresh": string - refresh Token,
}
```

Response body:
```
{
  "refresh": string - refresh Token,
  "access": string - access Token
}
```
