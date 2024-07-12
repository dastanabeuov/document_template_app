require 'rails_helper'

RSpec.describe Template, type: :model do
  # Validation tests
  context 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:content) }
  end

  # Custom method tests
  describe '#word_count' do
    let(:template) { Template.new(title: "Test Template", content: "This is a test template content") }

    it 'returns the correct word count' do
      expect(template.word_count).to eq(5)
    end

    it 'returns zero for empty content' do
      template.content = ""
      expect(document.word_count).to eq(0)
    end
  end
end
