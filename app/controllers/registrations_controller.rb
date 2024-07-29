class RegistrationsController < Devise::RegistrationsController
  def new
    super
  end

  def create
    super do |resource|
      if params[:user][:company_name].present?
        company = Company.find_or_create_by(name: params[:user][:company_name])
        Membership.create(user: resource, company: company)
      end
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :company_name)
  end
end
