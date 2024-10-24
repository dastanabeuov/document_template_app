class SetDefaultRoleOnMemberships < ActiveRecord::Migration[7.1]
  disable_ddl_transaction!

  def up
    change_column_default :memberships, :role, 0

    Membership.unscoped.in_batches do |batch|
      batch.update_all(role: 0)
      sleep(0.01) # Чтобы снизить нагрузку на базу данных
    end
  end
end
