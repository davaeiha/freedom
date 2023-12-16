FROM node:18-alpine3.17

RUN apk update && apk upgrade
RUN apk add --no-cache \
  openssh \
  rsync \
  curl \
  ca-certificates

# Download and install the Minio client
# RUN curl -LO https://dl.min.io/client/mc/release/linux-amd64/mc && \
#   chmod +x mc && \
#   mv mc /usr/local/bin/

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install 

ADD prisma ./prisma
COPY .env ./
RUN yarn prisma:generate

COPY . .
RUN yarn build

CMD node dist/main