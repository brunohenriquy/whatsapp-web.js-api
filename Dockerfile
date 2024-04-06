FROM node:20-alpine

WORKDIR /usr/src/app

ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true" \
    NODE_ENV="production"
RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium

COPY package*.json ./

RUN npm ci --only=production --ignore-scripts

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]