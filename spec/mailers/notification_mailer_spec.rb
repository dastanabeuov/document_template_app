require "rails_helper"

RSpec.describe NotificationMailer, type: :mailer do
  describe "welcome_email" do
    let(:user) { create(:user) }
    
    context "when language is English" do
      let(:email) { NotificationMailer.welcome_email(user, :en) }
      
      it "sends the email" do
        expect { email.deliver_now }.to change { ActionMailer::Base.deliveries.count }.by(1)
      end
      
      it "sends to the correct recipient" do
        expect(email.to).to eq([user.email])
      end
      
      it "has correct English subject" do
        expect(email.subject).to include("Welcome")
      end
      
      it "has correct English content" do
        expect(email.body.encoded).to include("Hello")
      end
    end
    
    context "when language is Russian" do
      let(:email) { NotificationMailer.welcome_email(user, :ru) }
      
      it "sends to the correct recipient" do
        expect(email.to).to eq([user.email])
      end
      
      it "has correct Russian subject" do
        expect(email.subject).to include("Добро пожаловать")
      end
    end
    
    context "when language is Kazakh" do
      let(:email) { NotificationMailer.welcome_email(user, :kz) }
      
      it "sends to the correct recipient" do
        expect(email.to).to eq([user.email])
      end
      
      it "has correct Kazakh subject" do
        expect(email.subject).to include("қош келдіңіз")
      end
    end
  end
end