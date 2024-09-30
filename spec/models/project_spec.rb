require 'rails_helper'

RSpec.describe Project, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:company) }

    it { should have_many(:documents).dependent(:destroy) }
  end
end
