.PHONY: help dev-db dev-backend dev-frontend dev docker-up docker-down

help:
	@echo "CampusRide - Available commands:"
	@echo "  make dev-db        Start MySQL via Docker"
	@echo "  make dev-backend   Run Spring Boot backend"
	@echo "  make dev-frontend  Run React frontend"
	@echo "  make docker-up     Start full stack with Docker Compose"
	@echo "  make docker-down   Stop Docker Compose"
	@echo "  make db-migrate    Apply SQL schema"

dev-db:
	docker run -d --name campusride-mysql -p 3306:3306 \
		-e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=campusride_db \
		mysql:8.0

dev-backend:
	cd backend && ./mvnw spring-boot:run

dev-frontend:
	cd frontend && npm run dev

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down

db-migrate:
	mysql -u root -p campusride_db < database/schema.sql
