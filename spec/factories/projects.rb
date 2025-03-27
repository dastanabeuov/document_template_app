FactoryBot.define do
  factory :project do
    title { generate(:string) }
    description { generate(:string) }
    
    association :company, factory: :company
  end
end
