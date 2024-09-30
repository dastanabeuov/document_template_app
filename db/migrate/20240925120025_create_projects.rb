class CreateProjects < ActiveRecord::Migration[7.1]
  def change
    create_table :projects do |t|
      t.string :title, null: false
      t.text :description
      t.references :company, null: false, foreign_key: true

      t.timestamps
    end
  end
end
