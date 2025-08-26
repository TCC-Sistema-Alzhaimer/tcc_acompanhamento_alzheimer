#!/bin/bash

PROJECT_NAME="alzheimer_stack"
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Arquivo .env não encontrado. Crie a partir de .env.example."
  exit 1
fi

docker compose --project-name "$PROJECT_NAME" -f "$COMPOSE_FILE" up --build -d

echo "Stack '$PROJECT_NAME' em execução."
echo "Acesse a API em: http://localhost:8080"
echo "Acesse o PgAdmin em: http://localhost:5050"
