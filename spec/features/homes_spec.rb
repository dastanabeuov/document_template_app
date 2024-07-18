require 'rails_helper'

RSpec.feature "Homes", type: :feature do
  scenario "GET /index" do
    visit root_path
    expect(page).to have_http_status(:success)
  end
end
