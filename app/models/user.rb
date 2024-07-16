class User < ApplicationRecord
  has_many :templates, dependent: :destroy

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
end
