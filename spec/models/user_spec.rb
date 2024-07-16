require 'rails_helper'

RSpec.describe User, type: :model do
  context 'associations' do
    it { should have_many(:templates).dependent(:destroy) }
  end
end
