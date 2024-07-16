FactoryBot.define do
  factory :template do
    title { "MyString" }
    content { "" }
    association :user
  end
end
