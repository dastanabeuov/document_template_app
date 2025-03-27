require 'rails_helper'

RSpec.feature "Companies", type: :feature do
  let(:admin) { create(:user) } #from test default user role admin
  let(:guest_user) { create(:user, :guest_user) }
  let(:company) { create(:company) }

  context 'when user is admin' do
    before do
      sign_in admin
    end

    scenario "GET /index" do
      visit companies_path
      expect(page).to have_http_status(:success)
    end

    scenario "GET /show/:id" do
      visit company_path(company)
      expect(page).to have_http_status(:success)
      expect(page).to have_content(company.name)
    end

    scenario "GET /new" do
      visit new_company_path
      expect(page).to have_http_status(:success)
    end

    scenario "POST /create with valid parameters" do
      visit new_company_path
      fill_in 'Name', with: 'New Company'
      click_button 'Save'
      
      expect(page).to have_content('Successfully created.')
      expect(Company.exists?(name: 'New Company')).to be_truthy
    end

    scenario "POST /create with invalid parameters" do
      visit new_company_path
      click_button 'Save'
      
      expect { Company.count }.not_to change { Company.count }
      expect(page).to have_content("Name can't be blank")
    end

    scenario "user updates a company" do
      visit edit_company_path(company)
      
      fill_in 'Name', with: 'Updated Company Name'
      click_button 'Save'
      
      expect(page).to have_content('Successfully updated.')
      expect(page).to have_content('Updated Company Name')
    end

    scenario "user deletes a company", js: true do
      visit company_path(company)

      accept_alert do
        click_button 'Destroy'
      end
      

      expect(page).to have_content('Company was successfully destroyed.')
      expect(page).not_to have_content(company.name)
    end
  end

  context "when user is non-admin" do
    before do
      sign_in guest_user
    end

    scenario "GET /index" do
      visit companies_path
      expect(page).to have_http_status(:success)
    end

    scenario "GET /show/:id" do
      visit company_path(company)
      expect(page).to have_http_status(:success)
    end

    scenario "non-admin cannot create a company" do
      visit new_company_path

      expect(current_path).to eq(companies_path)
      expect(page).to have_content('Access denied!')
    end
  end
end
