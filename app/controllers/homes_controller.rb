class HomesController < ApplicationController
  before_action :authenticate_user!

  def index
    six_months_ago = Date.today - 6.months
    @users_by_month = User.where("last_sign_in_at >= ?", six_months_ago)
                          .group_by_month(:last_sign_in_at, last: 6)
                          .count

    @latest_trunsactions_documents = Document.latest(10)
    @templates = Template.all

    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path, current: true }
    ]

    render partial: 'homes/right_panels/dashboard' if turbo_frame_request?
  end
end
