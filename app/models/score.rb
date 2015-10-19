class Score < ActiveRecord::Base
  validates  :score, :numericality => { :greater_than_or_equal_to => 0 }
  belongs_to :user

  scope :sort_in_desc, -> { order('score desc') }


  def self.score_greater_than user_max_score
    where("score > #{user_max_score}")
  end

  def self.max_score
    sort_in_desc.first.score
  end

  def self.get_ranking user_max_score
    score_greater_than(user_max_score).count + 1
  end

end
