require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { create(:user) }
  let(:company) { create(:company) }

  context 'associations' do
    it { should have_many(:templates).dependent(:destroy) }
    it { is_expected.to have_many(:memberships).dependent(:destroy) }
    it { is_expected.to have_many(:companies).through(:memberships) }
  end

  describe 'associating companies through memberships' do
    before do
      @membership1 = create(:membership, user: user, company: company)
      @membership2 = create(:membership, user: user, company: create(:company))
    end

    it 'allows user to have multiple companies' do
      expect(user.companies.count).to eq(2)
    end

    it 'allows user to have companies through memberships' do
      expect(user.companies).to include(@membership1.company)
      expect(user.companies).to include(@membership2.company)
    end

    it 'removes associated memberships when user is deleted' do
      expect { user.destroy }.to change { Membership.count }.by(-2)
    end
  end
end
