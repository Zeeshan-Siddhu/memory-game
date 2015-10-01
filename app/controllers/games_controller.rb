class GamesController < ApplicationController

  #GET /games/memory_game
  def memory_game
  end

  #POST add_score_and_get_rankings
  def add_score_and_get_rankings
    user = User.find_or_create_by(user_name: params[:user_name], email: params[:email])
    Score.create score: (params[:score] || 0), user_id: user.id
    user_max_score = Score.where(user_id: user.id).order('score desc').first.score
    ranking = Score.where("score > #{user_max_score}").count + 1
    respond_to do |format|
      format.json { render json:  { scores: Score.order('score desc').as_json(include: [:user]), user_max_score: user_max_score, ranking: ranking } }
    end
  end

end