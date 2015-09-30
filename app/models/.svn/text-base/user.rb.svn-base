class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable
         
  has_one :profile
  has_one :element, :foreign_key => "creator_id"
  has_many :experience_element_records
  #belongs_to :license, :foreign_key => "right_id"

  accepts_nested_attributes_for :profile
  attr_accessor :first_name, :last_name, :avatar
  
  has_many :shared_experiences
  has_many :experiences, :through => :shared_experiences, :foreign_key => "experience_id"
  
  public
  #METHOD PARA AVERIGUAR SI UN USUARIO ES USUARIO NORMAL
  
  def admin?
    return self.is_a?(Admin) 
  end
  
end
