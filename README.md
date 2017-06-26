# config-example
Example of a configuration solution with dynamic contextualization

# Installation

````
node install
NODE_ENV=development node index.js
````

# Environments

By changing the enviroment, you can change the context and subsequent configuration.

development - App uses port 3000 and selects the SQL Lite3 DB settings.
production - App uses port 8080 and selects the Postgres DB settings.

# Features

We currently have a fake test feature flag 'ENFORCE_CAP_LIMIT' is set to true by default but gets modified based on the dynamic context.

# Test Endpoints
In order to see the static content, visit:
````
curl http://localhost:3000/static_context | jq
````

resulting in

````
{
  "environment": "development",
  "colocation": "west"
}
````

To see the static config, visit:
````
curl http://localhost:3000/static_config | jq
````

resulting in

````
{
  "ENFORCE_CAP_LIMIT": true,
  "lang": "en-US",
  "internal": false,
  "timeout": 1000,
  "logLevel": "debug",
  "appPort": 3000,
  "client": "sqlite3",
  "connection": {
    "filename": "./dev.sqlite3"
  },
  "cap_limit": 0
}
````

The dynamic context is evaluated per request and can be see by visiting:

````
curl -X GET http://localhost:3000/dynamic_context -H 'username: jdoe@sixfivelabs.com' | jq
````

resulting in

````
{
  "environment": "development",
  "colocation": "west",
  "bucket": [
    "internal"
  ]
}
````

which results in the following dynamic configuration:

````
curl -X GET http://localhost:3000/dynamic_config -H 'username: jdoe@sixfivelabs.com' | jq
````

resulting in

````
{
  "ENFORCE_CAP_LIMIT": false,
  "lang": "en-US",
  "internal": true,
  "timeout": 1000,
  "logLevel": "debug",
  "appPort": 3000,
  "client": "sqlite3",
  "connection": {
    "filename": "./dev.sqlite3"
  },
  "cap_limit": 0
}

````

