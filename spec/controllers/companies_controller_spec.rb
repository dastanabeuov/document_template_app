require 'rails_helper'

RSpec.describe CompaniesController, type: :controller do
  let(:admin) { create(:user) } #user default created role admin
  let(:guest_user) { create(:user, :guest_user) }
  let(:company) { create(:company) }

  describe "GET #index" do
    context "as admin" do
      it "returns a success response" do
        sign_in admin
        get :index
        expect(response).to be_successful
      end
    end

    context "as guest user" do
      it "returns a success response" do
        sign_in guest_user
        get :index
        expect(response).to be_successful
      end
    end
  end

  describe "GET #show" do
    it "returns a success response" do
      sign_in admin
      get :show, params: { id: company.id }
      expect(response).to be_successful
    end
  end

  describe "GET #new" do
    context "as an admin" do
      it "returns a success response" do
        sign_in admin
        get :new
        expect(response).to be_successful
      end
    end

    context "as a non-admin" do
      it "redirects to the companies path with an alert" do
        sign_in guest_user
        get :new

        expect(response).to redirect_to(companies_path)
        expect(flash[:alert]).to eq('Access denied!')
      end
    end
  end

  describe "POST #create" do
    before { sign_in admin }

    context "with valid params" do
      it "creates a new Company" do
        expect {
          post :create, params: { company: attributes_for(:company) }
        }.to change(Company, :count).by(1)
      end

      it "redirects to the created company" do
        post :create, params: { company: attributes_for(:company) }
        expect(response).to redirect_to(Company.last)
        expect(flash[:notice]).to eq('Successfully created.')
      end
    end

    context "with invalid params" do
      it "does not create a new Company" do
        expect {
          post :create, params: { company: attributes_for(:company, name: nil) }
        }.not_to change(Company, :count)
      end

      it "renders the new template with 422 status" do
        post :create, params: { company: attributes_for(:company, name: nil) }
        expect(response).to render_template(:new)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "as a non-admin" do
      it "redirects to the companies path with an alert" do
        sign_in guest_user
        post :create, params: { company: attributes_for(:company) }

        expect(response).to redirect_to(companies_path)
        expect(flash[:alert]).to eq('Access denied!')
      end
    end
  end

  describe "PATCH/PUT #update" do
    before { sign_in admin }

    context "with valid params" do
      it "updates the requested company" do
        patch :update, params: { id: company.id, company: { name: 'Updated Name' } }
        company.reload
        expect(company.name).to eq('Updated Name')
      end

      it "redirects to the company with a success notice" do
        patch :update, params: { id: company.id, company: { name: 'Updated Name' } }
        expect(response).to redirect_to(company)
        expect(flash[:notice]).to eq('Successfully updated.')
      end
    end

    context "with invalid params" do
      it "renders the edit template with 422 status" do
        patch :update, params: { id: company.id, company: { name: nil } }
        expect(response).to render_template(:edit)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "DELETE #destroy" do
    before { sign_in admin }
    let!(:company) { create(:company) }

    it "destroys the requested company" do
      expect {
        delete :destroy, params: { id: company.id }
      }.to change(Company, :count).by(-1)
    end

    it "redirects to the companies list with a success notice" do
      delete :destroy, params: { id: company.id }
      expect(response).to redirect_to(companies_path)
      expect(flash[:notice]).to eq('Successfully destroyed.')
    end
  end
end
