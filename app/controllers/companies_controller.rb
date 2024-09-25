class CompaniesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_company, only: [:show, :edit, :update, :destroy]
  before_action :check_admin, only: [:new, :create]

  rescue_from ActiveRecord::RecordNotFound, with: :company_not_found

  load_and_authorize_resource

  def index
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.companies')}", current: true }
    ]

    @user_companies = current_user&.companies
    @companies = Company.all

    render partial: 'homes/right_panels/companies' if turbo_frame_request?
  end

  def show
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.companies')}", url: companies_path },
      { name: "#{@company.id}", current: true }
    ]
  end

  def new
    @company = Company.new
  end

  def create
    @company = Company.new(company_params)

    if @company.save
      redirect_to @company, notice: 'Company was successfully created.'
    else
      render :new, alert: 'Company was not created.', status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @company.update(company_params)
      redirect_to @company, notice: 'Company was successfully updated.'
    else
      render :edit, alert: 'Company was not updated.', status: :unprocessable_entity
    end
  end

  def destroy
    @company.destroy
    redirect_to companies_path, notice: 'Company was successfully destroyed.'
  end

  private

    def company_not_found
      redirect_to companies_path, alert: 'Company not found.'
    end

    def check_admin
      redirect_to companies_path, alert: 'Access denied!' unless current_user.admin?
    end

    def set_company
      @company ||= Company.find(params[:id])
    end

    def company_params
      params.require(:company).permit(:name)
    end
end
