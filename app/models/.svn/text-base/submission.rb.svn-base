class Submission < Element
  belongs_to :activity, :foreign_key => "parent_id"
  belongs_to :lesson_plan, :foreign_key => "parent_id"
  has_many :experience_element_records, :foreign_key => "element_id"
  
  acts_as_list :scope => [:parent_id.blank? ? "": :parent_id, :type]
end