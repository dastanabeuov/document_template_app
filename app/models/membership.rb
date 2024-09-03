class Membership < ApplicationRecord
  enum role: { member: 0, owner: 1 }

  belongs_to :user
  belongs_to :company

  validates :company_id, presence: true
  validates :user_id,    presence: true, uniqueness: { scope: :company_id,
    message: "should only have one membership per company" }
end
