# planode-zoo

#Setup
To setup the project's libraries you must use the following commands:
```
npm i
```

You should use a .env file that contains the following configurations:
```
PORT=3000

DB_HOST=localhost
DB_NAME=PlanodeZoo
DB_USER=username
DB_PASSWORD=password
DB_PORT=3306
SECRET=MYSECRETLITTLECAT

ENV_TYPE=PROD or DEV
```
# Start

To start the project in dev mode you must use the following command:
```
npm run dev
```

To build and start the project you must use the following command:
```
npm run build
npm run start
```

#Usage
## Postman
To use test the different api routes you can import the postman JSON joined to the project 

## Swagger
Otherwise, you could access the swagger interface available with the link http://{HOSTNAME}:{PORT}/ 
