class Template < ApplicationRecord
  default_scope { order(created_at: :DESC) }

  validates :title, presence: true, uniqueness: {
      message: ->(object, data) do
        "Hey #{object.title}, #{data[:value]} is already taken."
      end
    }
end
