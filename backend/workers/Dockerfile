# Use the static-ffmpeg image to get ffmpeg and ffprobe binaries
FROM mwader/static-ffmpeg:5.1.2 AS ffmpeg

# Build the main application using the node image
FROM --platform=linux/amd64 node:16 AS build

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Copy ffmpeg and ffprobe binaries from the ffmpeg image
COPY --from=ffmpeg /ffmpeg /usr/bin/
COPY --from=ffmpeg /ffprobe /usr/bin/

RUN apt-get update && \
    apt-get install -y pkg-config libpng-dev libjpeg-dev librsvg2-dev \
    build-essential \
    xserver-xorg-dev libxi-dev libxext-dev libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libxi-dev \
    libglu1-mesa-dev \
    libglew-dev \
    python2.7 \
    python-pip \
    xvfb

RUN npm install -g canvas
RUN npm install -g gl

RUN npm install -g npm@9.6.2
RUN npm ci

ARG REDIS_HOST
ENV REDIS_HOST $REDIS_HOST

ARG MONGO_URI
ENV MONGO_URI $MONGO_URI

ARG SERVER_PORT
ENV SERVER_PORT $SERVER_PORT

ARG FRONTEND_ENDPOINT
ENV FRONTEND_ENDPOINT $FRONTEND_ENDPOINT

ARG S3_ACCESS_KEY
ENV S3_ACCESS_KEY $S3_ACCESS_KEY

ARG S3_SECRET_ACCESS_KEY
ENV S3_SECRET_ACCESS_KEY $S3_SECRET_ACCESS_KEY

ARG S3_BUCKET_REGION
ENV S3_BUCKET_REGION $S3_BUCKET_REGION

ARG S3_BUCKET_NAME
ENV S3_BUCKET_NAME $S3_BUCKET_NAME

ARG STRIPE_SECRET_KEY
ENV STRIPE_SECRET_KEY $STRIPE_SECRET_KEY

ARG STRIPE_ENDPOINT_SK
ENV STRIPE_ENDPOINT_SK $STRIPE_ENDPOINT_SK

ARG OPENAI_KEY
ENV OPENAI_KEY $OPENAI_KEY

ARG REACT_APP_AUTH0_DOMAIN
ENV AUTH0_DOMAIN $REACT_APP_AUTH0_DOMAIN

ARG AUTH0_TENANT
ENV AUTH0_TENANT $AUTH0_TENANT

ARG SESSION_SECRET
ENV SESSION_SECRET $SESSION_SECRET

ARG REACT_APP_AUTH0_AUD
ENV AUTH0_AUDIENCE $REACT_APP_AUTH0_AUD

ARG AUTH0_BASE_URL
ENV AUTH0_BASE_URL $AUTH0_BASE_URL

ARG AUTH0_JWKS_URI
ENV AUTH0_JWKS_URI $AUTH0_JWKS_URI

ARG SENDGRID_API_KEY
ENV SENDGRID_API_KEY $SENDGRID_API_KEY

ARG TWILIO_ACCOUNT_SID
ENV TWILIO_ACCOUNT_SID $TWILIO_ACCOUNT_SID

ARG TWILIO_AUTH_TOKEN
ENV TWILIO_AUTH_TOKEN $TWILIO_AUTH_TOKEN

ARG TWILIO_PHONE_NUMBER
ENV TWILIO_PHONE_NUMBER $TWILIO_PHONE_NUMBER


RUN echo "AUTH0_DOMAIN: $REACT_APP_AUTH0_DOMAIN"
RUN echo "AUTH0_CLIENT_ID: $REACT_APP_AUTH0_CLIENT_ID"
RUN echo "MONGO_URI: $MONGO_URI"
RUN echo "FRONTEND_ENDPOINT: $FRONTEND_ENDPOINT"

# Bundle app source
COPY . .

# Start 'server.js' and 'videoWorker.js' concurrently
CMD "node workers/videoWorker.js"
