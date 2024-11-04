require 'rails_helper'

RSpec.describe DocumentImage, type: :model do
  it { should belong_to(:document).optional }
  it { should have_one_attached(:image) }

  it 'can have one attached image' do
    document_image = DocumentImage.new
    document_image.image.attach(io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'image.png')), filename: 'test_image.png', content_type: 'image/png')

    expect(document_image.image).to be_attached
  end
end
