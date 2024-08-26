Rails.application.routes.draw do
  root "homes#index"

  devise_for :users, controllers: { registrations: 'registrations' }
  devise_scope :user do
    get '/users/sign_out' => 'devise/sessions#destroy'
  end

  resources :documents do
    post :upload_image, on: :collection
  end

  resources :templates do
    post :create_document, on: :member
    post :upload_image, on: :collection
  end

  resources :companies do
    resources :memberships, only: [:create, :destroy]
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
