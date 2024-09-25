class TemplatesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_template, only: %i[show edit update destroy create_document]

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
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.templates')}", current: true }
    ]

    @templates = Template.all

    render partial: 'homes/right_panels/templates' if turbo_frame_request?
  end

  def show
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.templates')}", url: templates_path },
      { name: "#{@template.id}", current: true }
    ]
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

  # def update
  #   if @template.update(template_params)
  #     redirect_to root_path, notice: 'Template was successfully updated.'
  #   else
  #     render :edit, alert: 'Template was not updated.', status: :unprocessable_entity
  #   end
  # end

  def update
    if @template.update(template_params)
      respond_to do |format|
        format.html { redirect_to @template, notice: 'Template was successfully updated.' }
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace('right-panel', partial: 'templates/show', locals: { template: @template })
        end
      end
    else
      respond_to do |format|
        format.html { render :edit, alert: 'Шаблон не был обновлён.', status: :unprocessable_entity }
        format.turbo_stream { render :edit, status: :unprocessable_entity }
      end
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

    def template_params
      params.require(:template).permit(:title, :content, :image)
    end
end
