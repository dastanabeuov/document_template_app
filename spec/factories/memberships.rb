FactoryBot.define do
  factory :membership do
    association :user
    association :company
  end
end
