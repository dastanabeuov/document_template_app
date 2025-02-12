require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module DocumentTemplateApp
  class Application < Rails::Application
    config.active_record.schema_format = :sql

    config.app_generators.scaffold_controller :responders_controller

    config.load_defaults 7.1
    config.time_zone = 'Almaty'
    config.i18n.fallbacks = true
    config.i18n.default_locale = :en
    config.i18n.available_locales = %i[ru kz en]

    config.autoload_lib(ignore: %w(assets tasks))

    config.generators do |g|
      g.test_framework :rspec,
                       fixtures: true,
                       model_specs: true,
                       controller_specs: true,

                       view_specs: false,
                       helper_specs: false,
                       request_specs: false,
                       routing_specs: false
      g.fixture_replacement :factory_bot, dir: "spec/factories"
    end
  end
end
