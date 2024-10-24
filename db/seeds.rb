user = User.new(email: 'web.dev.adk@gmail.com',
                password: '123123',
                password_confirmation: '123123',
                role: "admin",)

user.skip_confirmation!
user.save!
