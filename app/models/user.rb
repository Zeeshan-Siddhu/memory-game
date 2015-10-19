class User < ActiveRecord::Base
  validates :email, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :create }
  has_many :scores

  def create_score score
    scores.create score: score
  end
end
