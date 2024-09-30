RSpec.describe ProjectsController, type: :controller do
  let(:company) { create(:company) }
  let(:project) { create(:project, company: company) }

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
