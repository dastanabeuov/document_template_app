class MembershipsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_company, only: [:create, :destroy]
  before_action :set_membership, only: [:destroy]

  def create
    user = User.find(params[:user_id])
    membership = @company.memberships.build(user: user)

    if membership.save
      flash[:notice] = 'User was successfully added to the company.'
      redirect_to @company
    else
      redirect_to @company, alert: membership.errors.full_messages.join(', ')
    end
  rescue ActiveRecord::RecordInvalid => e
    redirect_to @company, alert: e.message
  end

  def destroy
    @membership.destroy
    flash[:notice] = 'User was successfully removed from the company.'
    redirect_to @company
  end

  private

  def set_company
    @company = Company.find(params[:company_id])
  end

  def set_membership
    @membership = @company.memberships.find(params[:id])
  end
end
