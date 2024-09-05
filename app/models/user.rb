class User < ApplicationRecord
  attr_accessor :company_name

  enum role: { guest: 0, admin: 1 }

  has_many :memberships, dependent: :destroy
  has_many :companies, through: :memberships, dependent: :destroy
  has_many :documents, dependent: :destroy
  has_many :templates, dependent: :destroy

  belongs_to :company, optional: true

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
end
