dev-db: 
	cd packages/dev-db && docker-compose up -d
dev-db-build: 
	cd packages/dev-db && docker-compose up --build -d
dev-down: 
	cd packages/dev-db && docker-compose down
dev-down-v:
	cd packages/dev-db && docker-compose down -v 


.PHONY: dev-db dev-db-build dev-down dev-down-v