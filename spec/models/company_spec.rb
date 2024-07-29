require 'rails_helper'

RSpec.describe Company, type: :model do
  let(:company) { create(:company) }
  let(:user) { create(:user) }
  let(:membership) { create(:membership, user: user, company: company) }

  describe 'associations' do
    it { should validate_presence_of(:name) }
    it { is_expected.to have_many(:memberships).dependent(:destroy) }
    it { is_expected.to have_many(:users).through(:memberships) }
  end

  describe 'associating users through memberships' do
    before do
      @membership1 = create(:membership, user: user, company: company)
      @membership2 = create(:membership, user: create(:user), company: company)
    end

    it 'allows company to have multiple users' do
      expect(company.users.count).to eq(2)
    end

    it 'allows company to have users through memberships' do
      expect(company.users).to include(@membership1.user)
      expect(company.users).to include(@membership2.user)
    end

    it 'removes associated memberships when company is deleted' do
      expect { company.destroy }.to change { Membership.count }.by(-2)
    end
  end
end
