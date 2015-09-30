class SettingsVocabulary < ActiveRecord::Base
  belongs_to :technical_setting, :foreign_key => :setting_id
  belongs_to :educational_setting, :foreign_key => :setting_id
  belongs_to :vocabulary
end