user = User.new(email: 'admin@bimtemplates.kazniisa.kz',
                password: '123123',
                password_confirmation: '123123',
                role: "admin",)

user.skip_confirmation!
user.save!
