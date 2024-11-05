Rails.application.routes.draw do
  root "homes#index"

  devise_for :users, controllers: { registrations: 'registrations' }
  devise_scope :user do
    get '/users/sign_out' => 'devise/sessions#destroy'
  end

  resources :templates do
    member do
      post :sample_template
      post :upload_image
    end

    collection do
      post :sample_template
      post :upload_image
    end
  end

  resources :companies do
    resources :memberships, only: [:create, :destroy] do
      collection do
        post :add_owner
      end
    end

    resources :projects do
      post :sample_document, on: :member

      resources :documents do
        member do
          get  :document_images
          post :upload_image
        end

        collection do
          post :create_from_template
        end
      end
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
