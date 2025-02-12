class ValidateForeignKeys < ActiveRecord::Migration[7.1]
  def change
    validate_foreign_key :documents, :projects
    validate_foreign_key :users, :companies
  end
end
