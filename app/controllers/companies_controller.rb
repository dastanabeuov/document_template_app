class CompaniesController < ApplicationController
  before_action :authenticate_user!
  before_action :check_admin, only: [:new, :create]

  before_action :set_breadcrumbs
  before_action :set_company, only: [:show, :edit, :update, :destroy]

  def index
    @user_companies = current_user&.companies
    @companies = Company.all
  end

  def show
    @users = User.all
  end

  def new
    @company = Company.new
  end

  def create
    @company = Company.new(company_params)

    if @company.save
      redirect_to @company, notice: 'Company was successfully created.'
    else
      render :new, alert: 'Company was not created.'
    end
  end

  def edit
  end

  def update
    if @company.update(company_params)
      redirect_to @company, notice: 'Company was successfully updated.'
    else
      render :edit, alert: 'Company was not updated.'
    end
  end

  def destroy
    @company.destroy
    redirect_to companies_path, notice: 'Company was successfully destroyed.'
  end

  private
    def set_breadcrumbs
      @breadcrumbs = [
        { name: '<i class="bi bi-house"></i>'.html_safe, url: root_path },
        { name: 'Companies', current: true }
      ]
    end

    def set_company
      @company ||= Company.find(params[:id])
    end

    def company_params
      params.require(:company).permit(:name)
    end

    def check_admin
      redirect_to(root_path, alert: 'Access denied!') unless current_user.admin?
    end
end
