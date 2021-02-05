Rails.application.routes.draw do
  root to: 'rooms#new'
  resources :rooms, only: [:new, :create, :show]
end
