require 'rails_helper'

RSpec.shared_examples_for "resourcable" do
  it { should have_many(:links).dependet(:destroy) }
  it { should have_many(:attachments)
  it { should have_many(:comments).dependet(:destroy) }
end
