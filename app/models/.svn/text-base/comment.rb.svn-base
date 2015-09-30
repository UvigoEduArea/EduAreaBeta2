class Comment < ActiveRecord::Base
  as_enum :type, [:Element, :ExperienceActivityEntry], :source => "resource_type", :map => :string
  
  belongs_to :elements, -> {where :resource_type => "Element"}, :foreign_key => "resource_id"
  belongs_to :experience_activity_entry, :foreign_key => "resource_id"
  belongs_to :user
end
