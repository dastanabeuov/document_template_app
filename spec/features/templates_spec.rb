require 'rails_helper'

RSpec.feature "Templates", type: :feature do
  let(:admin) { create(:user) } #default user role: admin
  let(:guest_user) { create(:user, :guest_user) }

  let(:template) { create(:template, user: admin) }

  context 'when user is admin' do

    before do
      sign_in admin
    end

    scenario "POST sample_template_templates_path" do
      visit templates_path
      #save_and_open_page
      click_button 'New'
    
      expect(page).to have_current_path(edit_template_path(Template.last), ignore_query: true)
      expect(page).to have_content('Successfully created.')
    end

    scenario "GET /edit/:id" do
      visit edit_template_path(template)
      expect(page).to have_http_status(:success)
    end

    scenario "user updates a template" do
      visit edit_template_path(template)

      fill_in 'Title', with: 'Updated Title'
      click_button 'Save'

      expect(page).to have_content('Successfully updated.')
      expect(page).to have_content('Updated Title')
    end

    scenario "user deletes a template", js: true do
      visit template_path(template)
      
      accept_alert do
        click_button 'Destroy'
      end

      expect(page).to have_content('Template was successfully destroyed.')
      expect(page).not_to have_content(template.title)
    end
  end

  context "when user non admin" do

    before do
      sign_in guest_user
    end

    scenario "GET /index" do
      visit templates_path
      expect(page).to have_http_status(:success)
    end

    scenario "GET /show/:id" do
      visit template_path(template)
      expect(page).to have_http_status(:success)
    end

    scenario "only admin can create template" do
      visit new_template_path

      expect(current_path).to eq(root_path)
      expect(page).to have_content('You are not authorized to access this page.')
    end
  end
end
