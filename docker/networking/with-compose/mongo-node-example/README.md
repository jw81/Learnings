# MongoDB Node.js Application

This is a simple Node.js application that connects to a MongoDB database and provides two endpoints:
- `GET /` to fetch the count of documents in the database.
- `GET /add` to add a new document to the database.

The application and database are fully managed using Docker Compose.

---


## Getting Started

Follow these steps to build and run the application.

### 1. Clone the Repository
If this project is stored in a repository, clone it to your local machine:
```bash
git clone <repository-url>
cd <repository-folder>
```

---

### 2. Build and Start the Application
Run the following command to start the application and database:
```bash
docker compose up --build
```

What this does:
- Builds the application image using the provided `Dockerfile`.
- Pulls the MongoDB image if not already available.
- Creates and starts containers for the application (`app`) and database (`mongo`).

---

### 3. Access the Application
Once the services are up and running, access the application at:

- **Get document count**: [http://localhost:8080/](http://localhost:8080/)
- **Add a document**: [http://localhost:8080/add](http://localhost:8080/add)

---

## Useful Commands

### Stop the Application
To stop the application while preserving data:
```bash
docker compose down
```

To stop the application **and remove the MongoDB data**:
```bash
docker compose down -v
```

---


### Rebuild the Application
If you make changes to the application code or dependencies, rebuild the containers:
```bash
docker compose up --build
```

---

## Project Structure

```
project-root/
├── Dockerfile
├── docker-compose.yml
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

- **Dockerfile**: Defines how the application container is built.
- **docker-compose.yml**: Orchestrates the `app` and `mongo` services.
- **index.js**: Node.js application code.
- **package.json / package-lock.json**: Defines Node.js dependencies.
- **README.md**: This file.

---

## Notes

- MongoDB data is stored persistently in a Docker volume (`mongo_data`). This ensures that data is retained even if containers are stopped.
- To completely reset the database, run:
  ```bash
  docker compose down -v
  ```