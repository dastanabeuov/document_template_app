require 'rails_helper'

RSpec.feature "Documents", type: :feature do
  let(:company) { create(:company) }
  let(:admin) { create(:user, company: company) } # default user role: admin
  let(:guest_user) { create(:user, :guest_user) }
  let(:document) { create(:document, user: admin) }

  context 'when user is admin' do
    before do
      sign_in admin
    end

    scenario "GET /new" do
      visit new_document_path
      expect(page).to have_http_status(:success)
    end

    scenario "GET /edit/:id" do
      visit edit_document_path(document)
      expect(page).to have_http_status(:success)
    end

    scenario "POST /create with valid parameters" do
      visit new_document_path
      fill_in 'Title', with: 'New Document'

      expect {
        click_button 'Create Document'
      }.to change { Document.count }.by(1)

      expect(page).to have_content('Document was successfully created.')
    end

    scenario "POST /create with invalid parameters" do
      visit new_document_path

      click_button 'Create Document'

      expect { Document.count }.not_to change { Document.count }
      expect(page).to have_content("Title can't be blank")
    end

    scenario "user updates a document" do
      visit edit_document_path(document)

      fill_in 'Title', with: 'Updated Title'
      click_button 'Update Document'

      expect(page).to have_content('Document was successfully updated.')
      expect(page).to have_content('Updated Title')
    end

    scenario "user deletes a document", js: true do
      visit document_path(document)

      accept_alert do
        click_button 'Destroy'
      end

      expect(page).to have_content('Document was successfully destroyed.')
      expect(page).not_to have_content(document.title)
    end
  end

  context "when user is non-admin" do
    before do
      sign_in guest_user
    end

    scenario "GET /index" do
      visit documents_path
      expect(page).to have_http_status(:success)
    end

    scenario "GET /show/:id" do
      visit document_path(document)
      expect(page).to have_http_status(:success)
    end

    scenario "only admin can create a document" do
      visit new_document_path

      expect(current_path).to eq(root_path)
      expect(page).to have_content('You are not authorized to access this page.')
    end
  end
end
