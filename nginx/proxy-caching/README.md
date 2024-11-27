
# Rails API with Docker and NGINX

This guide outlines the setup of a Rails API with a single `GET` endpoint for an "animals" resource. The project is fully containerized using Docker and includes an NGINX reverse proxy for caching API responses.

## Project Structure

```bash
nginx/proxy-caching
├── docker-compose.yml
├── nginx
│   └── default.conf
├── rails
│   └── animals-api
│       ├── Dockerfile
│       ├── entrypoint.sh
│       └── (Rails app files)
```

## Step-by-Step Setup

### 1. Create the Project Directory

```bash
mkdir -p nginx/proxy-caching
cd nginx/proxy-caching
mkdir nginx rails
touch docker-compose.yml
```

### 2. Generate the Rails Application

Generate the Rails API-only application using a temporary Docker container:

```bash
docker run --rm -v "$(pwd)/rails:/app" -w /app ruby:3.2.3 bash -c \
"gem install bundler && bundle init && bundle add rails && rails new animals-api --api --database=postgresql"
```

### 3. Set Up the Rails Dockerfile

Navigate to `rails/animals-api` and create a `Dockerfile`:

```bash
cd rails/animals-api
touch Dockerfile
```

Add the following content:

```Dockerfile
FROM ruby:3.2.3
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs
WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN gem install bundler && bundle install
COPY . .
EXPOSE 3000
CMD ["bash", "/app/entrypoint.sh"]
```

### 4. Set Up the `entrypoint.sh` Script

Create the `entrypoint.sh` script inside `rails/animals-api`:

```bash
touch entrypoint.sh
```

Add the following content:

```bash
#!/bin/bash
set -e
rm -f /app/tmp/pids/server.pid
bundle exec rails db:migrate 2>/dev/null || bundle exec rails db:setup
bundle exec rails s -b '0.0.0.0'
```

Make it executable:

```bash
chmod +x entrypoint.sh
```

### 5. Configure `docker-compose.yml`

In the main project directory (`nginx/proxy-caching`), edit `docker-compose.yml`:

```yaml
version: '3'

services:
  db:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: animals_db

  rails:
    build: ./rails/animals-api
    volumes:
      - ./rails/animals-api:/app
    working_dir: /app
    environment:
      DATABASE_URL: postgres://postgres:password@db:5432/animals_db
    depends_on:
      - db
    ports:
      - "3000:3000"

  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ./cache:/var/cache/nginx
    ports:
      - "80:80"
    depends_on:
      - rails

volumes:
  postgres_data:
```

### 6. Set Up Rails Routes, Model, and Controller

#### a. Define Routes

In `rails/animals-api/config/routes.rb`, define the `animals` resource:

```ruby
Rails.application.routes.draw do
  resources :animals, only: [:show]
end
```

#### b. Generate the Animal Model

Run:

```bash
docker compose run rails rails g model Animal name:string species:string
docker compose run rails rails db:migrate
```

#### c. Set Up the Controller

In `rails/animals-api/app/controllers/animals_controller.rb`, add:

```ruby
class AnimalsController < ApplicationController
  def show
    animal = Animal.find(params[:id])
    response.headers['Cache-Control'] = 'public, max-age=3600'
    render json: animal
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Animal not found" }, status: :not_found
  end
end
```

### 7. Set Up NGINX Configuration

In `nginx/proxy-caching/nginx`, create `default.conf`:

```bash
touch default.conf
```

Add the following content:

```nginx
server {
    listen 80;

    location / {
        proxy_pass http://rails:3000;
        proxy_cache my_cache;
        proxy_cache_valid 200 1h;
        proxy_cache_use_stale error timeout updating;
        add_header X-Cache-Status $upstream_cache_status;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;
```

### 8. Build and Start the Containers

Build the images:

```bash
docker compose build
```

Start the services:

```bash
docker compose up
```

### 9. Initialize the Database

Run:

```bash
docker compose run rails rails db:create db:migrate
```

### 10. Test the API and NGINX Caching

1. Create an animal record:

   ```bash
   docker compose run rails rails console
   Animal.create(name: "Lion", species: "Panthera leo")
   ```

2. Fetch the animal:

   ```bash
   curl http://localhost/animals/1
   ```

3. Check the caching headers:

   ```bash
   curl -I http://localhost/animals/1
   ```

   - `X-Cache-Status: MISS` on the first request.
   - `X-Cache-Status: HIT` on subsequent requests.

