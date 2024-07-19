class TemplateImage < ApplicationRecord
  has_one_attached :image

  belongs_to :template, optional: true
end
