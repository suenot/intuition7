sudo apt update
sudo apt install -y git curl docker.io docker-compose

sudo groupadd docker
sudo usermod -aG docker $USER
docker run hello-world
docker rm $(docker ps -a -q --filter "ancestor=hello-world")

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18 && nvm use 18 && nvm alias default 18
npm i -g npm@latest

export DEEPCASE_HOST="deepcase.profitmaker.klava.org"
export DEEPLINKS_HOST="deeplinks.profitmaker.klava.org"
export DEEPAUTH_HOST="auth.profitmaker.klava.org"
export DEEPAPP_HOST="profitmaker.klava.org"

git clone https://github.com/deep-foundation/dev && (cd dev && npm ci)
(cd dev && node configure-nginx.js --configurations "$DEEPCASE_HOST 3007" "$DEEPLINKS_HOST 3006" "$DEEPAUTH_HOST 4001" "$DEEPAPP_HOST 7010" --certbot-email suenot@gmail.com)

npm rm --unsafe-perm -g @deep-foundation/deeplinks
npm install --unsafe-perm -g @deep-foundation/deeplinks@latest

export HASURA_ADMIN_SECRET=$(node -e "console.log(require('crypto').randomBytes(24).toString('hex'));")
export POSTGRES_PASSWORD=$(node -e "console.log(require('crypto').randomBytes(24).toString('hex'));")
export MINIO_ACCESS_KEY=$(node -e "console.log(require('crypto').randomBytes(24).toString('hex'));")
export MINIO_SECRET_KEY=$(node -e "console.log(require('crypto').randomBytes(24).toString('hex'));")
tee call-options.json << JSON
{
  "operation": "run",
  "envs": {
    "DEEPLINKS_PUBLIC_URL": "https://$DEEPLINKS_HOST",
    "NEXT_PUBLIC_DEEPLINKS_URL": "https://$DEEPLINKS_HOST",
    "NEXT_PUBLIC_GQL_PATH": "$DEEPLINKS_HOST/gql",
    "NEXT_PUBLIC_GQL_SSL": "1",
    "NEXT_PUBLIC_DEEPLINKS_SERVER": "https://$DEEPCASE_HOST",
    "NEXT_PUBLIC_ENGINES_ROUTE": "0",
    "NEXT_PUBLIC_DISABLE_CONNECTOR": "1",
    "JWT_SECRET": "'{\"type\":\"HS256\",\"key\":\"$(node -e "console.log(require('crypto').randomBytes(50).toString('base64'));")\"}'",
    "DEEPLINKS_HASURA_STORAGE_URL": "http://host.docker.internal:8000/",
    "HASURA_GRAPHQL_ADMIN_SECRET": "$HASURA_ADMIN_SECRET",
    "MIGRATIONS_HASURA_SECRET": "$HASURA_ADMIN_SECRET",
    "DEEPLINKS_HASURA_SECRET": "$HASURA_ADMIN_SECRET",
    "POSTGRES_PASSWORD": "$POSTGRES_PASSWORD",
    "HASURA_GRAPHQL_DATABASE_URL": "postgres://postgres:$POSTGRES_PASSWORD@postgres:5432/postgres",
    "POSTGRES_MIGRATIONS_SOURCE": "postgres://postgres:$POSTGRES_PASSWORD@host.docker.internal:5432/postgres?sslmode=disable",
    "RESTORE_VOLUME_FROM_SNAPSHOT": "0",
    "MANUAL_MIGRATIONS": "1",
    "MINIO_ROOT_USER": "$MINIO_ACCESS_KEY",
    "MINIO_ROOT_PASSWORD": "$MINIO_SECRET_KEY",
    "S3_ACCESS_KEY": "$MINIO_ACCESS_KEY",
    "S3_SECRET_KEY": "$MINIO_SECRET_KEY"
  }
}
JSON

docker ps -a

export DEEPLINKS_CALL_OPTIONS=$(cat call-options.json)
export DEBUG="deeplinks:engine:*,deeplinks:migrations:*"
deeplinks

docker ps -a