default: up

# Set the default service to web for the log command
# make log service=your_service
service = web

up:
	@docker-compose up -d

down:
	@docker-compose down

build:
	@docker-compose build

re: down build up

cli:
	@docker rmi $(docker images -a -q)

clean:
	@docker system prune -a

prune: down
	@docker system prune -a -f

fclean: down clean prune

log:
	@docker-compose logs -f $(service)

install:
	@pip3 install -r requirements.txt

get-req:
	@pip3 freeze > requirements.txt
	@echo "Requirements updated"

mig:
	@docker-compose run web python manage.py makemigrations
	@docker-compose run web python manage.py migrate

superuser:
	@docker-compose exec web python manage.py createsuperuser

collect:
	@docker-compose exec web python manage.py collectstatic

status:
	@docker-compose ps

help:
	@echo "Available commands:"
	@echo "  make up          - Start the project"
	@echo "  make down        - Stop the project"
	@echo "  make build       - Build the project"
	@echo "  make re          - Restart the project"
	@echo "  make cli         - Remove all images"
	@echo "  make clean       - Remove all containers"
	@echo "  make prune       - Remove all images and containers"
	@echo "  make fclean      - Remove all images, containers and volumes"
	@echo "  make log         - Show logs"
	@echo "  make install     - Install requirements"
	@echo "  make get-req     - Update requirements.txt"
	@echo "  make mig         - Make migrations and migrate"
	@echo "  make superuser   - Create superuser"
	@echo "  make collect     - Collect static files"
	@echo "  make status      - Show status of containers"
	@echo "  make help        - Show this help message"

.PHONY: default up down build re cli clean prune fclean log install mig help
