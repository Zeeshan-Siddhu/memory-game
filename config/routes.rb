Rails.application.routes.draw do
  resource :games do
    collection do 
      get 'memory_game'
      patch 'user'
    end
  end 

  match '/*path', :controller => 'web_hits', :action => 'options', :constraints => {:method => 'OPTIONS'}, :via => :options # If its an OPTIONS request this is called 
end
