class TemplatesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_template, only: %i[show edit update destroy create_document]
  before_action :set_breadcrumbs

  protect_from_forgery except: :upload_image

  rescue_from ActiveRecord::RecordNotFound, with: :template_not_found

  load_and_authorize_resource

  def create_document
    #debugger
    if current_user.company
      unique_title = @template.title
      count = 1
      while Document.exists?(title: unique_title)
        unique_title = "#{@template.title} (#{count})"
        count += 1
      end

      @document = current_user.company.documents.new(
        title: unique_title,
        content: @template.content,
        template: @template,
        user: current_user
      )

      if @document.save
        redirect_to @document, notice: 'Document was successfully created from template.'
      else
        redirect_to @template, alert: 'Failed to create document from template: ' + @document.errors.full_messages.to_sentence
      end
    else
      redirect_to @template, alert: 'First create a company.'
    end
  end

  def index
    @templates = Template.all
  end

  def show
  end

  def new
    @template = current_user.templates.new
  end

  def edit
  end

  def create
    @template = current_user.templates.new(template_params)

    if @template.save
      redirect_to @template, notice: 'Template was successfully created.'
    else
      render :new, alert: 'Template was not created.', status: :unprocessable_entity
    end
  end

  def update
    if @template.update(template_params)
      redirect_to @template, notice: 'Template was successfully updated.'
    else
      render :edit, alert: 'Template was not updated.', status: :unprocessable_entity
    end
  end

  def destroy
    @template.destroy
    redirect_to templates_url, notice: 'Template was successfully destroyed.'
  end

  def upload_image
    image = params[:image]

    if image.nil?
      render json: { success: 0, error: "No image found in request" }
      return
    end

    uploaded_image = TemplateImage.create!(image: image)

    stored_image_url = rails_blob_url(uploaded_image.image)

    render json: { success: 1, file: { url: stored_image_url } }
  rescue StandardError => e
    render json: { success: 0, error: e.message }
  end

  private
    def template_not_found
      redirect_to templates_url, alert: 'Template not found.'
    end

    def set_template
      @template ||= Template.find_by_id(params[:id])
    end

    def set_breadcrumbs
      @breadcrumbs = [
        { name: '<i class="bi bi-house"></i>'.html_safe, url: root_path },
        { name: 'Templates', current: true }
      ]
    end

    def template_params
      params.require(:template).permit(:title, :content, :image)
    end
end
