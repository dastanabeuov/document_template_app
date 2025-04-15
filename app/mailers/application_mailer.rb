class ApplicationMailer < ActionMailer::Base
  default from: %{"BIM Templates" <noreply@bimtemplates.kazniisa.kz>}
  layout "mailer"
end
