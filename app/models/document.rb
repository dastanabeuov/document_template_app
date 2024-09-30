class Document < ApplicationRecord
  include TemplateImagesHandler

  belongs_to :user
  belongs_to :template, optional: true
  belongs_to :company, optional: true
  belongs_to :project, optional: true

  has_many :document_images, dependent: :destroy

  validates :title, presence: true, uniqueness: true

  scope :latest, ->(limit = 10) { order(created_at: :desc).limit(limit) }

  def author_of_document?(document, user)
    document.user_id == user.id
  end
end
