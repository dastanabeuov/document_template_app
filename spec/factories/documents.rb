FactoryBot.define do
  factory :document do
    sequence(:title) { |n| "Sample Title #{n}" }
    content { "" }
    association :user
    association :template
  end
end
