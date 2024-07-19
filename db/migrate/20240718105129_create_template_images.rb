class CreateTemplateImages < ActiveRecord::Migration[7.1]
  def change
    create_table :template_images do |t|
      t.belongs_to :template, foreign_key: true

      t.timestamps
    end
  end
end
