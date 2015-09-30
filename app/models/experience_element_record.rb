class ExperienceElementRecord < ActiveRecord::Base
  
  belongs_to :user
  belongs_to :experience, :foreign_key => "element_id"
  belongs_to :submission, :foreign_key => "element_id"
  has_many :element_records
  
end