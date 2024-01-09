FROM php:8.1 as php
WORKDIR /var/www/html

RUN apt-get update -y && apt-get install -y \
    libicu-dev \
    # libmariadb-dev \
    unzip zip \
    zlib1g-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev libpq-dev libcurl4-gnutls-dev \
    iputils-ping \
    telnet

RUN docker-php-ext-configure gd --enable-gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_mysql bcmath exif

RUN pecl install -o -f redis \
    && rm -rf /tmp/pear \
    && docker-php-ext-enable redis

COPY . .

COPY --from=composer:2.3.5 /usr/bin/composer /usr/bin/composer
COPY docker-php.ini /usr/local/etc/php/conf.d/custom-php.ini

RUN groupadd -g 1000 chat_group
RUN useradd -u 1000 -g chat_group -m chat_user
USER chat_user

ENV PORT=8000
ENTRYPOINT [ "./Docker/entrypoint.sh" ]

# ==============================================================================
# #  node
# FROM node:14-alpine as node

# WORKDIR /var/www
# COPY . .

# RUN npm install --global cross-env
# RUN npm install

# VOLUME /var/www/node_modules