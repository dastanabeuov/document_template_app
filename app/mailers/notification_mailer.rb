class NotificationMailer < ApplicationMailer
  def welcome_email(user, locale = nil)
    @user = user
    
    I18n.with_locale(locale || user.preferred_locale || I18n.default_locale) do
      @subject = I18n.t('notification_mailer.welcome_email.subject', name: @user.email)
      
      mail(
        to: @user.email,
        subject: @subject
      )
    end
  end
end
