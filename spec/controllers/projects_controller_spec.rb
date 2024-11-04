require 'rails_helper'

RSpec.describe ProjectsController, type: :controller do
  let(:user) { create(:user) }
  let(:company) { create(:company) }
  let(:membership) { create(:membership, user: user, company: company) }
  let(:project) { create(:project, company: company) }

  before do
    login(user)
  end

  describe 'GET #index' do
    it 'returns a success response' do
      get :index, params: { company_id: company.id }
      expect(response).to be_successful
    end
  end

  describe 'POST #create' do
    it 'creates a new project' do
      expect {
        post :create, params: { company_id: company.id, project: { title: 'New Project', description: 'Project description' } }
      }.to change(Project, :count).by(1)
    end
  end
end
