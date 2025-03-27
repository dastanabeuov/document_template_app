RSpec.configure do |config|
  config.before(:suite) do
    # Полная очистка базы перед запуском всех тестов
    DatabaseCleaner.clean_with(:truncation)
  end

  config.before(:each) do |example|
    # Выбор стратегии в зависимости от типа теста
    if example.metadata[:js]
      DatabaseCleaner.strategy = :truncation
    else
      DatabaseCleaner.strategy = :transaction
    end
  end

  config.around(:each) do |example|
    # Используем один around блок для очистки
    DatabaseCleaner.cleaning do
      example.run
    end
  end
end