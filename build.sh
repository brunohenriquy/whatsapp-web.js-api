#! /bin/bash

docker buildx build --platform linux/amd64,linux/arm64 -t brunohenriquy/whatsapp-web-js-api:latest .

docker push brunohenriquy/whatsapp-web-js-api:latest
