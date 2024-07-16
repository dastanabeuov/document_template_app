class AddUserIdToTemplates < ActiveRecord::Migration[7.1]
  disable_ddl_transaction!

  def change
    add_reference :templates, :user, null: false, index: {algorithm: :concurrently}
  end
end
