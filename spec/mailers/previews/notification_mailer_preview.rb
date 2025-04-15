# Preview all emails at http://localhost:3000/rails/mailers/notification_mailer_mailer
class NotificationMailerPreview < ActionMailer::Preview
  def welcome_email_en
    user = User.first || User.new(email: "john@example.com", password: "123123", password_confirmation: "123123")
    NotificationMailer.welcome_email(user, :en)
  end
  
  def welcome_email_ru
    user = User.first || User.new(email: "john@example.com", password: "123123", password_confirmation: "123123")
    NotificationMailer.welcome_email(user, :ru)
  end
  
  def welcome_email_kz
    user = User.first || User.new(email: "john@example.com", password: "123123", password_confirmation: "123123")
    NotificationMailer.welcome_email(user, :kz)
  end
end
