FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@test.com" }
    password { "password" }
    password_confirmation { "password" }
    role { :admin }
    confirmed_at { Time.now }

    trait :guest_user do
      role { :guest }
    end

    trait :with_company do
      after(:create) do |user|
        create(:membership, user: user, company: create(:company))
      end
    end
  end
end
