# Base image with Ruby 3.2.3
FROM ruby:3.2.3

# Install dependencies
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs

# Set working directory
WORKDIR /app

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install bundler and gems
RUN gem install bundler && bundle install

# Copy the rest of the application code
COPY . .

# Expose the port for Puma
EXPOSE 3000

# Start the server
CMD ["bash", "/app/entrypoint.sh"]
