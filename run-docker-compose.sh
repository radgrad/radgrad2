#!/usr/bin/env bash

export METEOR_SETTINGS=$(cat ./config/settings.development.json)

# Startup Docker-Compose. Note: Be sure that docker-compose.yml is same directory as this script.
docker-compose up -d --remove-orphans

