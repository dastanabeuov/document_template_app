class Template < ApplicationRecord
  include TemplateImagesHandler

  default_scope { order(created_at: :DESC) }

  belongs_to :user, required: true

  has_many :template_images, dependent: :destroy

  validates :title, presence: true, uniqueness: true
end
