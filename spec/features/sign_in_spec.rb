require 'rails_helper'

RSpec.feature "User SignIn", type: :feature do
  given(:user) { create(:user) }

  scenario "user signs in with valid credentials" do
    sign_in(user)
    expect(page).to have_content("Signed in successfully.")
  end

  scenario "user signs in with invalid credentials" do
    visit new_user_session_path
    fill_in 'Email', with: user.email
    fill_in 'Password', with: 'wrongpassword'
    click_button 'Log in'
    expect(page).to have_content("Invalid Email or password.")
  end
end
