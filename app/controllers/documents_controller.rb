class DocumentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_document, only: [:show, :edit, :update, :destroy]
  before_action :check_membership, only: [:show, :edit, :update, :destroy]
  before_action :set_breadcrumbs

  protect_from_forgery except: :upload_image

  rescue_from ActiveRecord::RecordNotFound, with: :document_not_found

  load_and_authorize_resource

  def index
    if current_user.admin?
      @documents = Document.all
    elsif !current_user.admin? && current_user.companies.any?
      @current_user_company_documents = Document.where(company_id: current_user.companies.pluck(:id))
    else
      @current_user_company_documents = []
    end
  end

  def show
  end

  def new
    if current_user.company
      @document = current_user.company.documents.new
    else
      redirect_to documents_path, alert: 'First company created.'
    end
  end

  def edit
  end

  def create
    @document = current_user.company.documents.new(document_params)
    @document.user = current_user
    if @document.save
      redirect_to @document, notice: 'Document was successfully created.'
    else
      render :new, alert: 'Document was not created.', status: :unprocessable_entity
    end
  end

  def update
    if @document.update(document_params)
      redirect_to @document, notice: 'Document was successfully updated.'
    else
      render :edit, alert: 'Document was not updated.', status: :unprocessable_entity
    end
  end

  def destroy
    @document.destroy
    redirect_to documents_url, notice: 'Document was successfully destroyed.'
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

    def document_not_found
      redirect_to documents_url, alert: 'Document not found.'
    end

    def set_breadcrumbs
      @breadcrumbs = [
        { name: '<i class="bi bi-house"></i>'.html_safe, url: root_path },
        { name: 'Documents', current: true }
      ]
    end

    def set_document
      @document ||= Document.find(params[:id])
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
