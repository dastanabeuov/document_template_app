# frozen_string_literal: true

lock '~> 3.19.1'

set :application, 'document_template_app'
set :repo_url, 'git@github.com:dastanabeuov/document_template_app.git'
set :rvm_type, :user
set :deploy_to, '/home/deploy/document_template_app'
set :deploy_user, 'deploy'
set :keep_releases, 3
set :rvm_ruby_version, 'ruby-3.3.4'

append :linked_files, '.env', 'config/database.yml', 'config/master.key'
append :linked_dirs, 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'public/system', 'storage'

after 'deploy:publishing', 'passenger:restart'
