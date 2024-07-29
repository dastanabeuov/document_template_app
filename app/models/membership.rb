class Membership < ApplicationRecord
  belongs_to :user
  belongs_to :company

  validates :user_id, uniqueness: { scope: :company_id, message: "should only have one membership per company" }
end
