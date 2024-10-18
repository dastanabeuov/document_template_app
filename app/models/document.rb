class Document < ApplicationRecord
  belongs_to :user
  belongs_to :template, optional: true
  belongs_to :company, optional: true
  belongs_to :project, optional: true

  has_many :document_images, dependent: :destroy
  accepts_nested_attributes_for :document_images, allow_destroy: true

  validates :title, presence: true, uniqueness: true

  scope :latest, ->(limit = 10) { order(created_at: :desc).limit(limit) }

  def author_of_document?(document, user)
    document.user_id == user.id
  end
end
