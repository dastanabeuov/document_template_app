source "https://rubygems.org"

ruby "3.2.2"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 7.1.3", ">= 7.1.3.4"

# The original asset pipeline for Rails [https://github.com/rails/sprockets-rails]
gem "sprockets-rails", "~> 3.5.2"

# Use postgresql as the database for Active Record
gem "pg", "~> 1.1"

# Use the Puma web server [https://github.com/puma/puma]
gem "puma", ">= 5.0"

# Use JavaScript with ESM import maps [https://github.com/rails/importmap-rails]
gem "importmap-rails", "~> 2.0.1"

# Hotwire's SPA-like page accelerator [https://turbo.hotwired.dev]
gem "turbo-rails", "~> 2.0.6"

# Hotwire's modest JavaScript framework [https://stimulus.hotwired.dev]
gem "stimulus-rails", "~> 1.3.4"

# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem "jbuilder", "~> 2.12.0"

# Use Redis adapter to run Action Cable in production
gem "redis", ">= 4.0.1"

# Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
gem "kredis", "~> 1.7.0"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
gem "bcrypt", "~> 3.1.18"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ mswin jruby ]

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", "~> 1.18.4", require: false

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", "~> 1.9.2", platforms: %i[ mri windows ]
  gem 'simplecov', require: false
  gem "rspec-rails", "~> 7.0.1"
  gem "factory_bot_rails", "~> 6.4.3"
  gem "faker", "~> 3.4"
  gem "database_cleaner-active_record", "~> 2.2"
  gem "shoulda-matchers", "~> 6.4.0"
  gem "rails-controller-testing", "~> 1.0.5"
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console", "~> 4.2.1"
  # Add speed badges [https://github.com/MiniProfiler/rack-mini-profiler]
  # gem "rack-mini-profiler"
  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  # gem "spring"
  gem "letter_opener", "~> 1.10"

  #deployers
  gem 'capistrano', '~> 3.19.1', require: false
  gem 'capistrano-bundler', '~> 2.1.1', require: false
  gem 'capistrano-rails', '~> 1.6.3', require: false
  gem 'capistrano-rvm', '~> 0.1.2', require: false
  gem 'capistrano-sidekiq', '~> 2.3.1', require: false
  # gem 'capistrano3-unicorn', require: false
  gem 'capistrano-passenger', '~> 0.2.1', require: false
end

group :test do
  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem "capybara", "~> 3.40.0"
  gem "selenium-webdriver", "~> 4.11"  # Ensure you're using the latest version
  gem 'webdrivers', '~> 5.2.0'
  gem "launchy", "~> 3.0.1"
  # Remove the 'webdrivers' gem if you are using Selenium 4.11+
end

## Additional gems
gem 'bootstrap', '~> 5.3.3'
gem 'popper_js', '~> 2.11.8'
#gem 'jquery-rails', '~> 4.6.0'
gem "sassc-rails", "~> 2.1.2"
gem "mysql2", "~> 0.5.6"
gem "thinking-sphinx", "~> 5.6.0"
gem "whenever", "~> 1.0.0", require: false
gem "sidekiq", "~> 6.0"
gem "sinatra", "~> 4.0.0", require: false
gem "oj", "~> 3.16.5"
gem "responders", "~> 3.1.1"
gem "slim-rails", "~> 3.6"
gem "rails-i18n", "~> 7.0"
gem "devise-i18n", "~> 1.12"
gem "devise", "~> 4.9"
gem "cancancan", "~> 3.6"
gem "strong_migrations", "1.0.0"
gem "groupdate", "6.4.0"
gem "ruby-vips", "~> 2.2.2"
gem "mini_racer", "~> 0.16.0"
gem "dotenv-rails", "~> 3.1.4"
gem "bigdecimal", "~> 3.1.8"
