class CreateTemplates < ActiveRecord::Migration[7.1]
  def change
    create_table :templates do |t|
      t.string :title, null: false
      t.text :content, null: false

      t.timestamps
    end
  end
end
