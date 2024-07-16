require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module DocumentTemplateApp
  class Application < Rails::Application
    # Use the responders controller from the responders gem
    config.app_generators.scaffold_controller :responders_controller

    config.load_defaults 7.1
    config.time_zone = 'Almaty'
    config.i18n.fallbacks = true
    config.i18n.default_locale = :ru
    config.i18n.available_locales = %i[ru kz en]

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
