require 'rails_helper'

RSpec.feature "Templates", type: :feature do
  given(:user) { create(:user) }
  let!(:template) { create(:template, user: user) }

  before do
    sign_in(user)
  end

  scenario "GET /index" do
    visit templates_path
    expect(page).to have_http_status(:success)
  end

  scenario "GET /show/:id" do
    visit template_path(template)
    expect(page).to have_http_status(:success)
  end

  scenario "GET /new" do
    visit new_template_path
    expect(page).to have_http_status(:success)
  end

  scenario "GET /edit/:id" do
    visit edit_template_path(template)
    expect(page).to have_http_status(:success)
  end

  scenario "POST /create with valid parameters" do
    visit new_template_path
    fill_in 'Title', with: 'New Template'

    expect {
      click_button 'Create Template'
    }.to change { Template.count }.by(1)

    expect(page).to have_content('Template was successfully created.')
  end

  scenario "POST /create with invalid parameters" do
    visit new_template_path
    fill_in 'Title', with: ''
    click_button 'Create Template'

    expect {Template.count}.not_to change { Template.count }
    expect(page).to have_content('Template was not created.')
  end

  scenario "user updates a template" do
    visit edit_template_path(template)

    fill_in 'Title', with: 'Updated Title'
    click_button 'Update Template'

    expect(page).to have_content('Template was successfully updated.')
    expect(page).to have_content('Updated Title')
  end

  scenario "user deletes a template", js: true do
    visit template_path(template)

    expect(page).to have_content(template.title)

    accept_confirm do
      click_button 'Destroy'
    end

    expect(page).to have_content('Template was successfully destroyed.')
    expect(page).not_to have_content(template.title)
  end
end
