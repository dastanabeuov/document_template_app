require 'rails_helper'

RSpec.describe DocumentsController, type: :controller do
  let(:company) { create(:company) }
  let(:user) { create(:user, company: company) }
  let(:template) { create(:template, user: user) }
  let(:document) { create(:document, user: user, template: template) }

  before do
    login(user)
  end

  describe "GET #index" do
    it "returns http success" do
      get :index
      expect(response).to have_http_status(:success)
      expect(assigns(:documents)).to eq([document])
    end
  end

  describe "GET #show" do
    it "returns a success response" do
      get :show, params: { id: document.id }

      expect(response).to be_successful
      expect(assigns(:document)).to eq(document)
    end
  end

  describe "GET #new" do
    it "returns a success response" do
      get :new

      expect(response).to have_http_status(:success)
      expect(assigns(:document)).to be_a_new(Document)
    end
  end

  describe "GET #edit" do
    it "returns a success response" do
      get :edit, params: { id: document.id }

      expect(response).to be_successful
      expect(assigns(:document)).to eq(document)
    end
  end

  describe "POST #create" do
    context "with valid params" do
      let(:valid_attributes) { attributes_for(:document, template_id: template.id) }

      it "creates a new Document" do
        expect {
          post :create, params: { document: valid_attributes }
        }.to change(Document, :count).by(1)
      end

      it "redirects to the created document" do
        post :create, params: { document: valid_attributes }
        expect(response).to redirect_to(Document.last)
      end
    end

    context "with invalid params" do
      let(:invalid_attributes) { attributes_for(:document, title: "") }

      it "renders a response with 422 status (i.e. to display the 'new' template)" do
        post :create, params: { document: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "PUT #update" do
    context "with valid params" do
      let(:new_attributes) { { title: 'New Title' } }

      it "updates the requested document" do
        put :update, params: { id: document.id, document: new_attributes }
        document.reload
        expect(document.title).to eq('New Title')
      end

      it "redirects to the document" do
        put :update, params: { id: document.id, document: new_attributes }
        expect(response).to redirect_to(document)
      end
    end

    context "with invalid params" do
      let(:invalid_attributes) { { title: '' } }

      it "renders a response with 422 status (i.e. to display the 'edit' template)" do
        put :update, params: { id: document.id, document: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys the requested document" do
      expect {
        delete :destroy, params: { id: document.id }
      }.to change(Document, :count).by(0)
    end

    it "redirects to the documents list" do
      delete :destroy, params: { id: document.id }
      expect(response).to redirect_to(documents_url)
    end
  end
end
