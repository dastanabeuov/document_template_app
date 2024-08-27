FactoryBot.define do
  factory :document do
    title { "Sample Title" }
    content { "" }
    association :user
    association :template
  end
end
