class SharedExperience < ActiveRecord::Base
  
  belongs_to :element, :foreign_key => :experience_id
  belongs_to :user
  
end