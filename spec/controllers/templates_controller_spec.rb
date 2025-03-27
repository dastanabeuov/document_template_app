require 'rails_helper'

RSpec.describe TemplatesController, type: :controller do
  let(:user) { create(:user) }
  let(:template) { create(:template, user: user) }

  before { sign_in user }

  describe "GET #index" do
    it "returns http success" do
      get :index
      expect(response).to have_http_status(:success)
      expect(assigns(:templates)).to eq([template])
    end
  end

  describe "GET #show" do
    it "returns http success" do
      get :show, params: { id: template.id }
      expect(response).to have_http_status(:success)
      expect(assigns(:template)).to eq(template)
    end
  end

  describe "GET #new" do
    it "returns http success" do
      get :new
      expect(response).to have_http_status(:success)
      expect(assigns(:template)).to be_a_new(Template)
    end
  end

  describe "GET #edit" do
    it "returns http success" do
      get :edit, params: { id: template.id }
      expect(response).to have_http_status(:success)
      expect(assigns(:template)).to eq(template)
    end
  end

  describe "POST #create" do
    context "with valid parameters" do
      let(:valid_attributes) { attributes_for(:template) }

      it "creates a new template" do
        expect {
          post :create, params: { template: valid_attributes }
        }.to change { Template.count }.by(1)
      end

      it "redirects to the created template" do
        post :create, params: { template: valid_attributes }
        expect(response).to redirect_to(Template.last)
      end
    end

    context "with invalid parameters" do
      let(:invalid_attributes) { attributes_for(:template, title: "") }

      it "does not create a new template" do
        expect {
          post :create, params: { template: invalid_attributes }
        }.not_to change { Template.count }
      end

      it "renders the new template" do
        post :create, params: { template: invalid_attributes }
        expect(response).to render_template(:new)
      end
    end
  end

  describe "PUT #update" do
    context "with valid parameters" do
      let(:new_attributes) { { title: 'Updated Title' } }

      it "updates the requested template" do
        put :update, params: { id: template.id, template: new_attributes }
        template.reload
        expect(template.title).to eq('Updated Title')
      end

      it "redirects to the template" do
        put :update, params: { id: template.id, template: new_attributes }
        expect(response).to redirect_to(template)
      end
    end

    context "with invalid parameters" do
      let(:invalid_attributes) { { title: '' } }

      it "does not update the template" do
        put :update, params: { id: template.id, template: invalid_attributes }
        template.reload
        expect(template.title).not_to eq('')
      end

      it "re-renders the edit template" do
        put :update, params: { id: template.id, template: invalid_attributes }
        expect(response).to render_template(:edit)
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys the requested template" do
      expect {
        delete :destroy, params: { id: template.id }
      }.to change(Template, :count).by(0)
    end

    it "redirects to the templates list" do
      delete :destroy, params: { id: template.id }
      expect(response).to redirect_to(templates_url)
    end
  end
end
