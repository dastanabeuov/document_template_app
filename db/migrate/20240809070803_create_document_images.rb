class CreateDocumentImages < ActiveRecord::Migration[7.1]
  def change
    create_table :document_images do |t|
      t.belongs_to :document, foreign_key: true

      t.timestamps
    end
  end
end
