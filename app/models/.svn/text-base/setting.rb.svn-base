class Setting < ActiveRecord::Base
  belongs_to :technical_setting, :foreign_key => "element_id"
  belongs_to :educational_setting, :foreign_key => "element_id"
  
  belongs_to :vocabulary_term, :foreign_key => "field_value"
  
   def self.cloneSettings(type, original, copy) 
     settings = Setting.where(:element_id => original, :parent_type => type)
     p settings
     unless settings.blank?
       settings.each do |setting|
         new_setting = setting.dup
         new_setting.element_id = copy
         new_setting.save
       end
     end
   end
  
end