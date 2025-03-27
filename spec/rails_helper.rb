require 'spec_helper'

ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../config/environment', __dir__)

# Предотвращение запуска тестов в продакшене
abort("The Rails environment is running in production mode!") if Rails.env.production?

require 'rspec/rails'
require 'shoulda/matchers'
require 'capybara/rspec'
require 'capybara/rails'
require 'selenium/webdriver'
require 'launchy'
require 'database_cleaner/active_record'

# Автоматическое подключение support-файлов
Dir[Rails.root.join('spec', 'support', '**', '*.rb')].each { |f| require f }

# Поддержка актуальной схемы базы данных
ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
  # Включение синтаксиса FactoryBot
  config.include FactoryBot::Syntax::Methods
  
  # Включение дополнительных хелперов
  config.include Devise::Test::ControllerHelpers, type: :controller
  config.include Devise::Test::IntegrationHelpers, type: :feature

  # Настройка драйвера для JavaScript-тестов
  Capybara.javascript_driver = :selenium_chrome_headless
  
  # Настройки Capybara
  Capybara.configure do |capybara_config|
    capybara_config.default_max_wait_time = 10
    capybara_config.match = :prefer_exact
  end

  # Пути к fixture
  config.fixture_path = "#{::Rails.root}/spec/fixtures"
  
  # Использование транзакционных fixtures
  config.use_transactional_fixtures = false
  
  # Автоопределение типа теста
  config.infer_spec_type_from_file_location!
  
  # Фильтрация бэктрейса Rails
  config.filter_rails_from_backtrace!

  # Очистка временных файлов после всех тестов
  config.after(:all) do
    FileUtils.rm_rf("#{Rails.root}/tmp/storage")
  end
end