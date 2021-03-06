# config-example
Example of a configuration solution with dynamic contextualization

# Installation

````
node install
NODE_ENV=development node index.js
````

# Environments

By changing the environment, you can change the context and subsequent configuration.

`development` - App uses port `3000` and selects the SQL Lite3 DB settings.

`production` - App uses port `8080` and selects the Postgres DB settings.

# Features

We currently have a fake test feature flag `ENFORCE_CAP_LIMIT` is set to true by default but gets disabled based by the dynamic context for internal users.

# Test Endpoints

Here are some demo endpoints:

- /static_context - display the static context following bootup
- /static_config - display the static configuration derived from the static context
- /dynamic_context - display the dynamic context based on the real-time request
- /dynamic_config - display the dynamic configuration derived from the dynamic context

In order to see the static content, visit:
````
curl http://localhost:3000/static_context | jq
````

resulting in

````
{
  "environment": "development",
  "colocation": "us-west-1"
}
````

To see the static config, visit:
````
curl http://localhost:3000/static_config | jq
````

resulting in

````
{
  "lang": "en-US",
  "internal": false,
  "logLevel": "debug",
  "feature_enforce_cap_limit": true,
  "cap_limit": 0,
  "appPort": 3000,
  "client": "sqlite3",
  "connection_filename": "./dev.sqlite3",
  "timeout": 1000
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
  "colocation": "us-west-1",
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
  "lang": "en-US",
  "internal": true,
  "logLevel": "debug",
  "feature_enforce_cap_limit": false,
  "cap_limit": 0,
  "appPort": 3000,
  "client": "sqlite3",
  "connection_filename": "./dev.sqlite3",
  "timeout": 1000
}

````

