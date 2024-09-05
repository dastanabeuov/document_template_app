class MembershipsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_company, only: [:create, :destroy, :add_owner]
  before_action :set_membership, only: [:destroy]
  before_action :check_owner, only: [:create, :destroy, :add_owner]

  def add_owner
    user = User.find(params[:user_id])
    membership = @company.memberships.find_by(user: user)
    if membership
      membership.update(role: :owner)
      redirect_to @company, notice: 'User was successfully updated as owner.'
    else
      redirect_to @company, alert: 'User is not a member of this company.'
    end
  end

  def create
    user = User.find(params[:user_id])
    @membership = @company.memberships.new(user: user, role: :member)

    if @membership.save
      redirect_to @company, notice: 'User was successfully added to the company.'
    else
      redirect_to @company, alert: @membership.errors.full_messages.join(', ')
    end
  end

  def destroy
    @membership.destroy
    redirect_to @company, notice: 'User was successfully removed from the company.'
  end

  private

  def set_company
    @company ||= Company.find(params[:company_id])
  end

  def set_membership
    @membership = @company.memberships.find(params[:id])
  end

  def check_owner
    redirect_to @company, alert: 'Access denied.' unless current_user.admin? || current_user.memberships.find_by(company: @company)&.role == 'owner'
  end
end
