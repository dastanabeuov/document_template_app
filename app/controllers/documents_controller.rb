class DocumentsController < ApplicationController
  before_action :set_company,      only:  [:create_from_template, :index, :show, :edit, :update, :new, :create, :destroy]
  before_action :set_project,      only:  [:create_from_template, :index, :show, :edit, :update, :new, :create, :destroy]
  before_action :set_template,     only:  [:create_from_template]
  before_action :set_document,     only:  [:show, :edit, :update, :destroy]
  before_action :check_membership, only:  [:show, :edit, :update, :destroy]

  protect_from_forgery except: :upload_image

  load_and_authorize_resource

  def create_from_template
    if current_user.company
      unique_title = @template.title
      count = 1
      while Document.exists?(title: unique_title)
        unique_title = "#{@template.title} (#{count})"
        count += 1
      end

      # Создание документа с определением всех необходимых отношений
      @document = Document.new(
        title: unique_title,
        content: @template.content,
        template: @template,
        user: current_user,
        company: @company,
        project: @project
      )

      if @document.save
        redirect_to company_project_document_path(@document.company, @document.project, @document), notice: 'Document was successfully created from template.'
      else
        redirect_to company_project_documents_path(@document.company, @document.project), alert: 'Failed to create document from template: ' + @document.errors.full_messages.to_sentence
      end
    else
      redirect_to root_path, alert: 'First create a company.'
    end
  end

  def index
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.companies')}", url: companies_path },
      { name: "#{@company.name}", url: company_path(@company) },
      { name: "#{I18n.t('.projects')}", url: company_projects_path(@company) },
      { name: "#{@project.title}", url: company_project_path(@company, @project) },
      { name: "#{I18n.t('.documents')}", current: true }
    ]

    @templates = Template.all
    @project_documents = @project.documents.includes(:project)
  end

  def show
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.companies')}", url: companies_path },
      { name: "#{@company.name}", url: company_path(@company) },
      { name: "#{I18n.t('.projects')}", url: company_projects_path(@company) },
      { name: "#{@project.title}", url: company_project_path(@company, @project) },
      { name: "#{I18n.t('.documents')}", url: company_project_documents_path(@company, @project) },
      { name: "#{@document.title}", current: true },
    ]
  end

  def new
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.companies')}", url: companies_path },
      { name: "#{@company.name}", url: company_path(@company) },
      { name: "#{I18n.t('.projects')}", url: company_projects_path(@company) },
      { name: "#{@project.title}", url: company_project_path(@company, @project) },
      { name: "#{I18n.t('.documents')}", url: company_project_documents_path(@company, @project) },
      { name: "#{I18n.t('.new')}", current: true }
    ]

    @document = @project.documents.new
  end

  def create
    @document = @project.documents.new(document_params)
    @document.user = current_user
    @document.company = @company
    @document.project = @project

    if @document.save
      @breadcrumbs = [
        { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
        { name: "#{I18n.t('.companies')}", url: companies_path },
        { name: "#{@company.name}", url: company_path(@company) },
        { name: "#{I18n.t('.projects')}", url: company_projects_path(@company) },
        { name: "#{@project.title}", url: company_project_path(@company, @project) },
        { name: "#{I18n.t('.documents')}", current: true }
      ]

      redirect_to [@company, @project, @document], notice: 'Document was successfully created.'
    else
      @breadcrumbs = [
        { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
        { name: "#{I18n.t('.companies')}", url: companies_path },
        { name: "#{@company.name}", url: company_path(@company) },
        { name: "#{I18n.t('.projects')}", url: company_projects_path(@company) },
        { name: "#{@project.title}", url: company_project_path(@company, @project) },
        { name: "#{I18n.t('.documents')}", current: true }
      ]

      redirect_to new_company_project_document_path(@company, @project), alert: 'Document was not created.'#, status: :unprocessable_entity
    end
  end

  def edit
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.companies')}", url: companies_path },
      { name: "#{@company.name}", url: company_path(@company) },
      { name: "#{I18n.t('.projects')}", url: company_projects_path(@company) },
      { name: "#{@project.title}", url: company_project_path(@company, @project) },
      { name: "#{I18n.t('.documents')}", url: company_project_documents_path(@company, @project) },
      { name: "#{@document.title}", url: company_project_document_path(@company, @project, @document) },
      { name: "#{I18n.t('.edit')}", current: true },
    ]
  end

  def update
    if @document.update(document_params)
      @breadcrumbs = [
        { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
        { name: "#{I18n.t('.companies')}", url: companies_path },
        { name: "#{@company.name}", url: company_path(@company) },
        { name: "#{I18n.t('.projects')}", url: company_projects_path(@company) },
        { name: "#{@project.title}", url: company_project_path(@company, @project) },
        { name: "#{I18n.t('.documents')}", current: true }
      ]

      redirect_to company_project_document_path(@company, @project, @document), notice: 'Document was successfully updated.'
    else
      @breadcrumbs = [
        { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
        { name: "#{I18n.t('.companies')}", url: companies_path },
        { name: "#{@company.name}", url: company_path(@company) },
        { name: "#{I18n.t('.projects')}", url: company_projects_path(@company) },
        { name: "#{@project.title}", url: company_project_path(@company, @project) },
        { name: "#{I18n.t('.documents')}", current: true }
      ]

      render :edit, alert: 'Document was not updated.', status: :unprocessable_entity
    end
  end

  def destroy
    @document.destroy
    redirect_to company_project_documents_path(@company, @project), notice: 'Document was successfully destroyed.'
  end

  def upload_image
    image = params[:image]

    if image.nil?
      render json: { success: 0, error: "No image found in request" }
      return
    end

    uploaded_image = DocumentImage.create!(image: image)

    stored_image_url = rails_blob_url(uploaded_image.image)

    render json: { success: 1, file: { url: stored_image_url } }
  rescue StandardError => e
    render json: { success: 0, error: e.message }
  end

  private

    def set_template
      @template = Template.find(params[:template_id])
    end

    def set_document
      @document = Document.find(params[:id])
    end

    def set_company
      @company = Company.find_by(id: params[:company_id])
    end

    def set_project
      @project = Project.find_by(id: params[:project_id])
    end

    def check_membership
      unless current_user.companies.exists?(id: @document.company_id) || current_user.admin?
        redirect_to root_path, alert: 'You are not authorized to access this document.'
      end
    end

    def document_params
      params.require(:document).permit(:title, :content, :image)
    end
end
