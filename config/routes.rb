Rails.application.routes.draw do
  resource :games do
    collection do 
      get 'memory_game'
      post 'add_score_and_get_rankings'
    end
  end 

  root :to => "games#memory_game", :via => :get
end
