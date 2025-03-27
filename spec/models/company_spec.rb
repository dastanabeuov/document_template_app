require 'rails_helper'

RSpec.describe Company, type: :model do
  let(:company) { create(:company) }
  let(:user1) { create(:user) }
  let(:user2) { create(:user) }
  let!(:membership1) { create(:membership, user: user1, company: company) }
  let!(:membership2) { create(:membership, user: user2, company: company) }

  describe 'associations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to have_many(:memberships).dependent(:destroy) }
    it { is_expected.to have_many(:users).through(:memberships) }
  end

  describe 'associating users through memberships' do
    it 'allows company to have multiple users' do
      expect(company.users.count).to eq(2)
    end

    it 'allows company to have users through memberships' do
      expect(company.users).to include(user1)
      expect(company.users).to include(user2)
    end

    it 'removes associated memberships when company is deleted' do
      expect { company.destroy }.to change { Membership.count }.by(-2)
    end
  end
end