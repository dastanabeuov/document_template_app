require 'rails_helper'

RSpec.describe HomesController, type: :controller do
  let(:user) { create(:user) }

  before do
    sign_in user
  end

  describe 'GET #index' do
    context 'render template index' do
      it 'renders the index page' do
        get :index

        expect(response).to be_successful
      end
    end

    context 'Additional information index page' do
      it 'assigns @users_by_month' do
        create_list(:user, 5, last_sign_in_at: Date.today)
        create_list(:user, 5, last_sign_in_at: 3.months.ago)

        get :index

        expect(assigns(:users_by_month)).to be_a(Hash)
        expect(assigns(:users_by_month).count).to eq(6)
      end

      it 'assigns @latest_transactions_documents' do
        create_list(:document, 7)

        get :index

        expect(assigns(:latest_trunsactions_documents).count).to eq(7)
      end

      it 'assigns @templates' do
        create_list(:template, 3)

        get :index

        expect(assigns(:templates).count).to eq(3)
      end

      it 'assigns breadcrumbs' do
        get :index

        expect(assigns(:breadcrumbs)).to include(
          { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path, current: true }
        )
      end

      it 'renders the index template' do
        get :index

        expect(response).to render_template(:index)
      end
    end
  end
end
