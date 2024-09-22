# AI Tarot Reading

- Adrianna Fowler

## Design

- [API design](docs/apis.md)
- [Data model](docs/data_model.md)
- [Wireframe on Excalidraw](https://excalidraw.com/#json=iKxh9mQ-fVk3DBOUAGSLx,6HB7E16hlxt9c2EmEs5rnA)
- [Wireframe local](docs/tarotAI.excalidraw)


## Intended Market

Individuals age 18-35 that have shown intrest in tarot or astrology.

## Functionality

-Landing page
-Account sign-up & login
-User decks page - shows all custom user decks as well as default deck
-Deck create, read, update, delete
-Card create, read, update, delete
-Reading create, read -- incorporation of Google Gemini API


## Project Initialization

To fully enjoy this application on your local machine, please make sure to follow these steps:
1. Fork and clone the repository down to your local machine.
2. CD into the new project directory
3. In the root of the project, you MUST create a .env file containing the following variables:
    - VITE_APP_API_HOST
    - POSTGRES_DB
    - POSTGRES_USER
    - POSTGRES_PASSWORD
    - POSTGRES_HOST
    - POSTGRES_PORT
    - DATABASE_URL
    - OS
    - SECRET_KEY
        - NOTE: you can generate a signing/secret key in several ways.
            - If you already have the command line utility `openssl` installed, you can run the following command to generate a signing key: `openssl rand -hex 32`
            - Alternatively, you can open a wsl terminal and run the same command: `openssl rand -hex 32`
    - GOOGLE_API_KEY
        - NOTE: you can obtain an API key by following the instructions at
            https://ai.google.dev/gemini-api/docs/api-key
    See a sample .env file for what it should contain below:

            ```
            VITE_APP_API_HOST=http://localhost:8100
            POSTGRES_DB=tarot_database
            POSTGRES_USER=user
            POSTGRES_PASSWORD=password
            POSTGRES_HOST=postgres
            POSTGRES_PORT=5432
            DATABASE_URL=postgresql://username:password@hostname:port/database_name
            SECRET_KEY=12345
            GOOGLE_API_KEY=replace_this_with_your_actual_api_key

            ```

4. Make sure Docker is installed and running then execute:
     `docker compose up --build`


## Install Extensions

-   Prettier: <https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode>
-   Black Formatter: <https://marketplace.visualstudio.com/items?itemName=ms-python.black-formatter>

### Installing python dependencies locally

In order for VSCode's built in code completion and intelligence to
work correctly, it needs the dependencies from the requirements.txt file
installed. We do this inside docker, but not in the workspace.

So we need to create a virtual environment and pip install the requirements.

From inside the `api` folder:

```bash
python -m venv .venv
```

Then activate the virtual environment

```bash
source .venv/bin/activate
```

And finally install the dependencies

```bash
pip install -r requirements.txt
```

Then make sure the venv is selected in VSCode by checking the lower right of the
VSCode status bar
