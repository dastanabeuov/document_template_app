require 'rails_helper'

RSpec.describe User, type: :model do
  context 'associations' do
    it { should have_many(:templates).dependent(:destroy) }
    it { is_expected.to have_many(:memberships).dependent(:destroy) }
    it { is_expected.to have_many(:companies).through(:memberships) }
  end

  describe 'associating companies through memberships' do
    let(:user) { create(:user) }
    let(:company1) { create(:company) }
    let(:company2) { create(:company) }
    let!(:membership1) { create(:membership, user: user, company: company1) }
    let!(:membership2) { create(:membership, user: user, company: company2) }

    it 'allows user to have multiple companies' do
      expect(user.companies.count).to eq(2)
    end

    it 'allows user to have companies through memberships' do
      expect(user.companies).to include(company1, company2)
    end

    it 'removes associated memberships when user is deleted' do
      expect { user.destroy }.to change { Membership.count }.by(-2)
    end
  end
end
