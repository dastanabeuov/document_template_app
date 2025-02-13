# frozen_string_literal: true

server '192.168.10.47', user: 'deploy', roles: %w[app web db], primary: true

set :rails_env, :production
set :branch, 'master'
set :ssh_options, {
  keys: %w[/Users/adk/.ssh/id_rsa],
  forward_agent: true,
  auth_methods: %w[publickey password],
  port: 22
}
