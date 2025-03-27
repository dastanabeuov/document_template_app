FactoryBot.define do
  factory :membership do
    association :user, factory: :user
    association :company, factory: :company
  end
end
