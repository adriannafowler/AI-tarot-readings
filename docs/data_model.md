# Data Models

- This project uses a PostgreSQL database.


## Deck

- The `decks` table contains information about the decks created by users.

| Property         | Type              | Unique | Optional | Other info                      |
|------------------|-------------------|--------|----------|---------------------------------|
| id               | SERIAL PRIMARY KEY | yes    | no       | primary key                     |
| name             | VARCHAR(150)       | no     | no       | char limit 150                  |
| exclude_negative | BOOLEAN            | no     | no       | default is True                 |
| img_url          | URL                | no     | yes      | null or blank allowed           |
| user_id          | INTEGER            | no     | yes      | foreign key referencing user    |


## Card

- The `cards` table contains the data about individual cards within a deck.

| Property    | Type              | Unique | Optional | Other info                      |
|-------------|-------------------|--------|----------|---------------------------------|
| id          | SERIAL PRIMARY KEY | yes    | no       | primary key                     |
| name        | VARCHAR(150)       | no     | no       | char limit 150                  |
| image_url   | URL                | no     | no       |                                 |
| description | TEXT               | no     | no       |                                 |
| is_negative | BOOLEAN            | no     | no       | default is False                |
| deck_id     | INTEGER            | no     | no       | foreign key referencing deck    |


## Reading

- The `readings` table contains the data for tarot readings done by users.

| Property    | Type              | Unique | Optional | Other info                      |
|-------------|-------------------|--------|----------|---------------------------------|
| id          | SERIAL PRIMARY KEY | yes    | no       | primary key                     |
| time_stamp  | TIMESTAMP          | no     | no       | automatically added on creation |
| title       | VARCHAR(150)       | no     | yes      | optional, default is null       |
| reading     | TEXT               | no     | no       |                                 |
| user_id     | INTEGER            | no     | yes      | foreign key referencing user    |
| cards       | ManyToMany         | no     | no       | many-to-many relationship with cards |


## User

- The `users` table contains data about a specific user of the app (using Django’s built-in user model).

| Property    | Type              | Unique | Optional | Other info   |
|-------------|-------------------|--------|----------|--------------|
| id          | SERIAL PRIMARY KEY | yes    | no       | primary key  |
| email       | VARCHAR            | yes    | no       |              |
| username    | VARCHAR            | yes    | no       |              |
| password    | VARCHAR            | no     | no       | hashed       |
| first_name  | VARCHAR            | no     | yes      |              |
| last_name   | VARCHAR            | no     | yes      |              |
