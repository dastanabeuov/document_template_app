FactoryBot.define do
  factory :template do
    title { generate(:string) }
    content { generate(:string) }
    
    association :user, factory: :user
  end
end
