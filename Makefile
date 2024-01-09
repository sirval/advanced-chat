setup:
	@make build
	@make up
	@env-copy
	@make app-key
	@jwt
build:
	docker-compose build --no-cache --force-rm
stop:
	docker-compose stop
up:
	docker-compose up -d
down:
	docker-compose down
composer-update:
	docker exec chat-php-1  bash -c "composer update --ignore-platform-req"
data:
	docker exec chat-php-1  bash -c "php artisan migrate:fresh && db:seed"
cli:
	docker exec -it chat-php-1 bash
dump-autoload:
	docker exec chat-php-1  bash -c "composer dump-autoload"
jwt:
	docker exec chat-php-1  bash -c "php artisan jwt:secret"
app-key:
	docker exec chat-php-1  bash -c "php artisan key:generate"
env-copy:
	docker exec chat-php-1  bash -c "cp .env.example .env"
migrate:
	docker exec chat-php-1  bash -c "php artisan migrate"