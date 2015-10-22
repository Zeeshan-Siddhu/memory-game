require 'rails_helper'

describe User do
  #validation

  context 'with valid email' do
    let(:user_with_valid_email) { create(:user) }
    # it 


    subject { user_with_valid_email }
    it "has a valid email" do
      is_expected.to be_valid
    end
  end  


  context 'with invalid email' do
    let(:user_with_invalid_email) { build(:user, email: 'sfgj') }
    it 'is invalid' do
      expect(user_with_invalid_email.valid?).to be(false)
    end

    it 'has invalid email' do
      user_with_invalid_email.valid?
      expect(user_with_invalid_email.errors.get(:email)).to eq(['is invalid'])
    end
  end

  describe '#create_score' do
    before(:each) do
      @user = create(:user)
    end
    context '#with invalid score' do
      it 'has no score' do
        score = -1
        @user.create_score score
        expect(@user.scores.count).to eq 0
      end  
    end
    context '#with valid score' do
      it 'has 1 score' do
        score = 10
        @user.create_score score
        expect(@user.scores.count).to eq 1
      end  
    end

  end 



end