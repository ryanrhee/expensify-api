#!/bin/bash

if [[ -f ./credentials.json ]]; then
    exit 0;
else
    echo 'Credentials file missing; create one via `yarn run auth:gen`.'
    exit -1;
fi