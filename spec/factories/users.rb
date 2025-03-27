FactoryBot.define do
  factory :user do
    email { generate(:email) }
    password { "password" }
    password_confirmation { "password" }
    role { :admin }
    confirmed_at { Time.now }

    trait :guest_user do
      role { :guest }
    end

    trait :with_company do
      after(:build) do |user|
        build(:membership, user: user, company: build(:company))
      end
    end
  end
end
