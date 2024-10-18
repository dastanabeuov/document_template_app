class CreateDocuments < ActiveRecord::Migration[7.1]
  def change
    create_table :documents do |t|
      t.string :title, null: false
      t.text :content, null: false
      t.references :user, null: false, foreign_key: true
      t.references :template, foreign_key: { on_delete: :nullify }
      t.references :company, foreign_key: { on_delete: :nullify }
      t.timestamps
    end
  end
end
