require 'rails_helper'

RSpec.describe DocumentsController, type: :controller do
  let(:user) { create(:user) } #default user created role admin
  let(:company) { create(:company) }
  let(:project) { create(:project, company: company) }
  let(:template) { create(:template) }
  let!(:membership) { create(:membership, user: user, company: company) }
  let(:document) { create(:document, user: user, company: company, project: project) }

  before do
    sign_in(user)
  end

  describe "GET #index" do
    it "returns http success" do
      get :index, params: { company_id: company.id, project_id: project.id }
      expect(response).to have_http_status(:success)
      expect(assigns(:documents)).to eq([document])
    end
  end

  describe "GET #show" do
    it "returns a success response" do
      get :show, params: { company_id: company.id, project_id: project.id, id: document.id }
      expect(response).to be_successful
      expect(assigns(:document)).to eq(document)
    end
  end

  describe "GET #new" do
    it "returns a success response" do
      get :new, params: { company_id: company.id, project_id: project.id }
      expect(response).to have_http_status(:success)
      expect(assigns(:document)).to be_a_new(Document)
    end
  end

  describe "GET #edit" do
    it "returns a success response" do
      get :edit, params: { company_id: company.id, project_id: project.id, id: document.id }
      expect(response).to be_successful
      expect(assigns(:document)).to eq(document)
    end
  end

  describe "POST #create" do
    context "with valid params" do
      let(:valid_attributes) { attributes_for(:document) }

      it "creates a new Document" do
        expect {
          post :create, params: {
            company_id: company.id,
            project_id: project.id,
            document: valid_attributes
          }
        }.to change(Document, :count).by(1)
      end

      it "redirects to the created document" do
        post :create, params: {
          company_id: company.id,
          project_id: project.id,
          document: valid_attributes
        }
        expect(response).to redirect_to(company_project_document_path(company, project, Document.last))
      end
    end

    context "with invalid params" do
      let(:invalid_attributes) { attributes_for(:document, title: "") }

      it "renders a response with 422 status" do
        post :create, params: {
          company_id: company.id,
          project_id: project.id,
          document: invalid_attributes
        }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "PUT #update" do
    context "with valid params" do
      let(:new_attributes) { { title: 'New Title' } }

      it "updates the requested document" do
        put :update, params: {
          company_id: company.id,
          project_id: project.id,
          id: document.id,
          document: new_attributes
        }
        document.reload
        expect(document.title).to eq('New Title')
      end

      it "redirects to the document" do
        put :update, params: {
          company_id: company.id,
          project_id: project.id,
          id: document.id,
          document: new_attributes
        }
        expect(response).to redirect_to(company_project_document_path(company, project, document))
      end
    end

    context "with invalid params" do
      let(:invalid_attributes) { { title: '' } }

      it "renders a response with 422 status" do
        put :update, params: {
          company_id: company.id,
          project_id: project.id,
          id: document.id,
          document: invalid_attributes
        }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys the requested document" do
      document # создаем документ
      expect {
        delete :destroy, params: {
          company_id: company.id,
          project_id: project.id,
          id: document.id
        }
      }.to change(Document, :count).by(-1)
    end

    it "redirects to the documents list" do
      delete :destroy, params: {
        company_id: company.id,
        project_id: project.id,
        id: document.id
      }
      expect(response).to redirect_to(company_project_documents_path(company, project))
    end
  end

  describe "POST #upload_image" do
    let(:image) { fixture_file_upload(Rails.root.join('spec', 'fixtures', 'files', 'image.png'), 'image/png') }

    it "uploads an image successfully" do
      post :upload_image, params: {
        company_id: document.company.id,
        project_id: document.project.id,
        id: document.id,
        "file-0": image,
        format: :json
      }

      expect(response).to be_successful
      expect(JSON.parse(response.body)['success']).to eq true
    end
  end

  describe "POST #create_from_template" do
    it "creates a document from template" do
      expect {
        post :create_from_template, params: {
          company_id: company.id,
          project_id: project.id,
          template_id: template.id
        }
      }.to change(Document, :count).by(1)

      expect(response).to redirect_to(company_project_document_path(company, project, Document.last))
      expect(flash[:notice]).to eq 'Successfully created.'
    end
  end
end
