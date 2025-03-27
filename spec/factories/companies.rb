FactoryBot.define do
  factory :company do
    name { generate(:string) }
  end
end
