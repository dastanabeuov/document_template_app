class Template < ApplicationRecord
  default_scope { order(created_at: :DESC) }

  belongs_to :user

  validates :title, presence: true, uniqueness: true
end
