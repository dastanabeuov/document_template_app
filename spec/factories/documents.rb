FactoryBot.define do
  factory :document do
    title { generate(:string) }
    content { generate(:string) }
    
    association :user, factory: :user
    association :template, factory: :template

    trait :pure do
      user nil
    end

    trait :pure do
      template nil
    end
  end
end
