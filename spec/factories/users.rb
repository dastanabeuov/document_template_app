FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@test.com" }
    password { "password" }
    password_confirmation { "password" }
    confirmed_at { Time.now }
  end
end
