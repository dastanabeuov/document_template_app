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


  #validates :phone, presence: true, format: { with: /^\+7\s\d{3}\s\d{3}\s\d{4}$/ }
  validates :email, presence: true
  validates :confirmation_token, uniqueness: true, allow_nil: true
  validates :reset_password_token, uniqueness: true, allow_nil: true
  validates :unlock_token, uniqueness: true, allow_nil: true
end
