User.create!({
  email: "admin@owlplanner.kz",
  password: "123123",
  password_confirmation: "123123",
  role: "admin",
  confirmed_at: Time.current
})
