require 'rails_helper'

RSpec.describe DocumentImage, type: :model do
  it { should belong_to(:document).optional }
  it { should have_one_attached(:image) }

  it 'can have one attached image' do
    subject { described_class.new }
    subject.image.attach(io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'image.png')), filename: 'test_image.png', content_type: 'image/png')

    expect(subject.image).to be_attached
  end
end
