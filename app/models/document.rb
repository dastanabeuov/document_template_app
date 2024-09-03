class Document < ApplicationRecord
  include TemplateImagesHandler

  belongs_to :user
  belongs_to :template, optional: true
  belongs_to :company, optional: true

  has_many :document_images, dependent: :destroy

  validates :title, presence: true, uniqueness: true

  def author_of_document?(document, user)
    document.user_id == user.id
  end
end
