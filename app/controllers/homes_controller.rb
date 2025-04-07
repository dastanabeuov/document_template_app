class HomesController < ApplicationController
  def index
    six_months_ago ||= Date.today - 6.months
    @users_by_month ||= User.where("last_sign_in_at >= ?", six_months_ago)
                          .group_by_month(:last_sign_in_at, last: 6)
                          .count

    @latest_trunsactions_documents ||= Document.where(
      user_id: current_user.id
    ).or(
      Document.where(company_id: current_user.company_ids)
    ).order(created_at: :desc)
    .limit(7)

    @templates ||= Template.last(4)

    @breadcrumbs ||= [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path, current: true }
    ]
  end
end
