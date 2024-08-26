FactoryBot.define do
  factory :document do
    title { "Sample Title" }
    content { "GoodWood" }
    association :user
    association :template
  end
end
