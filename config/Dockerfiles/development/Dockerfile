FROM node:8-slim

RUN apt-get update && apt-get install -yq libgconf-2-4

RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
      --no-install-recommends
    
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.1/dumb-init_1.2.1_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# other deps
RUN apt-get install -y git

# clean
RUN rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

COPY package.json /app/

WORKDIR app
# Install deps for server.
RUN yarn

#COPY local.conf /etc/fonts/local.conf
COPY . /app/

# Uncomment to skip the chromium download when installing puppeteer.
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install puppeteer so it can be required by user code that gets run in
# server.js. Cache bust so we always get the latest version of puppeteer when
# building the image.
ARG CACHEBUST=1

# Add pptr user.
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Run user as non privileged.
USER pptruser

EXPOSE 1337

ENTRYPOINT ["dumb-init", "--"]
CMD ["yarn", "start"]