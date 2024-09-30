class Project < ApplicationRecord
  belongs_to :company

  has_many :documents, dependent: :destroy

  validates :title, presence: true, uniqueness: true
end
