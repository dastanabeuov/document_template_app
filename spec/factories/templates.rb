FactoryBot.define do
  factory :template do
    sequence(:title) { |n| "UniqueTitle#{n} - #{Faker::Lorem.sentence(word_count: 3)}" }
    content { nil }
    association :user
  end
end
