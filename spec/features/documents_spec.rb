require 'rails_helper'

RSpec.feature "Documents", type: :feature do
  let(:company) { create(:company) }
  let(:admin) { create(:user, company: company) } # default user role: admin
  let(:guest_user) { create(:user, :guest_user) }
  let(:project) { create(:project, company: company) }
  let(:document) { create(:document, company: company, project: project, user: admin) }

  context 'when user is admin' do
    before do
      sign_in admin
    end

    scenario "GET /edit/:id" do
      visit edit_company_project_document_path(company, project, document)
      expect(page).to have_http_status(:success)
    end

    scenario "user updates a document" do
      visit edit_company_project_document_path(company, project, document)

      fill_in 'Title', with: 'Updated Title'
      
      click_button 'Save'

      expect(page).to have_content('Successfully updated.')
      expect(page).to have_content('Updated Title')
    end

    scenario "user deletes a document", js: true do
      visit company_project_document_path(company, project, document)

      accept_alert do
        click_button 'Destroy'
      end

      expect(page).to have_content('Successfully destroyed.')
      expect(page).not_to have_content(document.title)
    end

    scenario "GET /index" do
      visit company_project_documents_path(company, project)
      expect(page).to have_http_status(:success)
    end
  end

  context "when user is non-admin" do
    before do
      sign_in guest_user
    end

    scenario "GET /index" do
      visit company_project_documents_path(company, project)
      expect(page).to have_http_status(:success)
    end

    scenario "GET /show/:id" do
      visit company_project_document_path(company, project, document)
      expect(page).to have_http_status(:success)
    end

    scenario "only admin can create a document" do
      visit new_company_project_document_path(company, project)

      expect(current_path).to eq(root_path)
      expect(page).to have_content('You are not authorized to access this page.')
    end
  end
end
