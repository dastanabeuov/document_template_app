class Company < ApplicationRecord
  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships

  default_scope { order(created_at: :DESC) }

  validates :name, presence: true, uniqueness: true
end
