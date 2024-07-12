require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module DocumentTemplateApp
  class Application < Rails::Application
    config.load_defaults 7.1
    config.time_zone = 'Almaty'

    config.autoload_lib(ignore: %w(assets tasks))

    config.generators do |g|
      g.test_framework :rspec,
                       # true specs ...
                       fixtures: true,
                       model_specs: true,
                       request_specs: true,
                       # false specs ...
                       controller_specs: false,
                       view_specs: false,
                       helper_specs: false,
                       routing_specs: false
      g.fixture_replacement :factory_bot, dir: "spec/factories"
    end
  end
end
