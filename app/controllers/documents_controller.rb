class DocumentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_document, only: [:show, :edit, :update, :destroy]
  before_action :set_breadcrumbs

  protect_from_forgery except: :upload_image

  rescue_from ActiveRecord::RecordNotFound, with: :document_not_found

  load_and_authorize_resource

  def index
    @documents = Document.all
  end

  def show
  end

  def new
    @document = current_user.documents.new
  end

  def edit
  end

  def create
    @document = current_user.documents.new(document_params)

    if @document.save
      redirect_to @document, notice: 'Document was successfully created.'
    else
      render :new, alert: 'Document was not created.'
    end
  end

  def update
    if @document.update(document_params)
      redirect_to @document, notice: 'Document was successfully updated.'
    else
      render :edit, alert: 'Document was not updated.'
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

    def document_params
      params.require(:document).permit(:title, :content, :image)
    end
end
