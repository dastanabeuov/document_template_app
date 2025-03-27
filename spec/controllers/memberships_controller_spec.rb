require 'rails_helper'

RSpec.describe MembershipsController, type: :controller do
  let(:company) { create(:company) }
  let(:user) { create(:user, :guest_user) }
  let(:admin) { create(:user) } # by default role is admin

  before { sign_in admin }

  describe 'POST #create' do
    context 'with valid params' do
      it 'adds the user to the company' do
        expect {
          post :create, params: { company_id: company.id, user_id: user.id }
        }.to change { company.users.count }.by(1)
        expect(company.users).to include(user)
      end

      it 'redirects to the company with a notice' do
        post :create, params: { company_id: company.id, user_id: user.id }
        expect(response).to redirect_to(company)
        expect(flash[:notice]).to eq('User was successfully added to the company.')
      end
    end

    context 'with invalid params' do
      before do
        allow_any_instance_of(Membership).to receive(:save).and_return(false)
        allow_any_instance_of(Membership).to receive_message_chain(:errors, :full_messages).and_return(['Invalid user or company'])
      end

      it 'does not add the user to the company' do
        expect {
          post :create, params: { company_id: company.id, user_id: user.id }
        }.not_to change { company.users.count }
        expect(company.users).not_to include(user)
      end

      it 'redirects to the company with an alert' do
        post :create, params: { company_id: company.id, user_id: user.id }
        expect(response).to redirect_to(company)
        expect(flash[:alert]).to eq('Invalid user or company')
      end
    end
  end

  describe 'DELETE #destroy' do
    before do
      company.users << user
      @membership = company.memberships.find_by(user: user)
    end

    it 'removes the user from the company' do
      expect {
        delete :destroy, params: { company_id: company.id, id: @membership.id }
      }.to change { company.users.count }.by(-1)
      expect(company.users).not_to include(user)
    end

    it 'redirects to the company with a notice' do
      delete :destroy, params: { company_id: company.id, id: @membership.id }
      expect(response).to redirect_to(company)
      expect(flash[:notice]).to eq('User was successfully removed from the company.')
    end
  end
end
