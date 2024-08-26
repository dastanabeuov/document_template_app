class DocumentImage < ApplicationRecord
  has_one_attached :image

  belongs_to :document, optional: true
end
