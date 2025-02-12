require "application_responder"

class ApplicationController < ActionController::Base
  include Localization
  self.responder = ApplicationResponder

  before_action :authenticate_user!

  respond_to :html, :js, :json

  include ErrorHandling

  rescue_from CanCan::AccessDenied do |exception|
    respond_to do |format|
      format.html { redirect_to root_url, alert: exception.message }
      format.js { head :forbiddens }
      format.json { head :forbidden }
    end
  end
end
