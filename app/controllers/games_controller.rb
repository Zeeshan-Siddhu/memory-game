class GamesController < ApplicationController

  #GET /games/memory_game
  def memory_game
  end

  #POST add_score_and_get_rankings
  def add_score_and_get_rankings
    #TODO strong params
    user = User.find_or_create_by(user_name: params[:user_name], email: params[:email])
    user.create_score params[:score]
    user_max_score = user.scores.max_score
    ranking = Score.get_ranking
    respond_to do |format|
      format.json { render json:  { scores: Score.sort_in_desc.as_json(include: [:user]), user_max_score: user_max_score, ranking: ranking } }
    end
  end

end