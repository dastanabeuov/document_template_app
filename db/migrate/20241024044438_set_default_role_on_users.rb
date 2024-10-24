class SetDefaultRoleOnUsers < ActiveRecord::Migration[7.1]
  disable_ddl_transaction!

  def up
    change_column_default :users, :role, 0

    User.unscoped.in_batches do |batch|
      batch.update_all(role: 0)
      sleep(0.01)
    end
  end
end
