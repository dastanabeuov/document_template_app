class AddForeignKeysWithoutValidation < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :documents, :projects, validate: false
    add_foreign_key :users, :companies, validate: false
  end
end
