class DataBox < ActiveRecord::Base
  
  belongs_to :box
  belongs_to :activity, :foreign_key => "element_id"
  belongs_to :lesson_plan, :foreign_key => "element_id"
  
  acts_as_list :scope => :box
  
  

end
