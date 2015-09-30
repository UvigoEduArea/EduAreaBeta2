class License < ActiveRecord::Base
  has_many :elements, :foreign_key => "right_id"
  has_one :profile
end