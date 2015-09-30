class Profile < ActiveRecord::Base
  
  belongs_to :user
  
  
  #Avatar
  has_attached_file :avatar, :styles => { :original => "300x300>", :medium => "200x200>", :thumb => "30x30>" }, :default_url => "/images/user/:style/user.png"
  #has_attached_file :avatar, :styles => { :medium => "200x200>", :thumb => "30x30>" }, :default_url => "/images/user/:style/user.png"
  validates_attachment_content_type :avatar, :content_type => %w(image/jpeg image/jpg image/png)
  
  belongs_to :license, :foreign_key => "right_id"
  
  has_many :elements, :through => :matrix_creations, :foreign_key => "element_id"
  has_many :matrix_creations, :foreign_key => "user_id"
  
  has_many :elements, :through => :matrix_views, :foreign_key => "element_id"
  has_many :matrix_views, :foreign_key => "user_id"

  has_many :elements, :through => :matrix_copies, :foreign_key => "element_id"
  has_many :matrix_copies, :foreign_key => "user_id"
 
  has_many :elements, :through => :matrix_includes, :foreign_key => "element_id"
  has_many :matrix_includes, :foreign_key => "user_id"
  
  has_many :elements, :through => :matrix_boards, :foreign_key => "element_id"
  has_many :matrix_boards, :foreign_key => "user_id"

end