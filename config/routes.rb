Rails.application.routes.draw do
  root "homes#index"

  devise_for :users, controllers: { registrations: 'registrations' }
  devise_scope :user do
    get '/users/sign_out' => 'devise/sessions#destroy'
  end

  resources :templates do
    post :upload_image, on: :collection
  end

  resources :companies do
    resources :memberships, only: [:create, :destroy] do
      collection do
        post :add_owner
      end
    end

    resources :projects do
      resources :documents do
        post :upload_image, on: :collection

        post 'create_from_template', on: :collection, as: 'create_from_template'
      end
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
