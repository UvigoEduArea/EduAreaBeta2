class Box < ActiveRecord::Base
  
  has_many :data_boxes
  
  belongs_to :template
  
  acts_as_list :scope => :template
  
  has_one :vocabulary
  
end
