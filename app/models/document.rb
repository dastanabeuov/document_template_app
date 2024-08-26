class Document < ApplicationRecord
  include TemplateImagesHandler

  belongs_to :user
  belongs_to :template, optional: true

  has_many :document_images, dependent: :destroy

  validates :title, presence: true, uniqueness: true
  #validates :content, presence: true
end
