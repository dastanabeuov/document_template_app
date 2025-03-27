FactoryBot.define do
  factory :document do
    title { generate(:string) }
    content { generate(:string) }
    
    association :user, factory: :user
    association :template, factory: :template
  end
end
