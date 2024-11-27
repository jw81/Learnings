#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f /app/tmp/pids/server.pid

# Run migrations and start the server
bundle exec rails db:migrate 2>/dev/null || bundle exec rails db:setup
bundle exec rails s -b '0.0.0.0'
