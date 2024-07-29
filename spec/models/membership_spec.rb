require 'rails_helper'

RSpec.describe Membership, type: :model do
  let(:user) { create(:user) }
  let(:company) { create(:company) }
  let(:membership) { create(:membership, user: user, company: company) }

  describe 'associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:company) }
  end
end
