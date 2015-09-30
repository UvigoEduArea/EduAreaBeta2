# -*- coding: utf-8 -*-
class AdminsController < ElementsController
  
  before_filter :authenticate_user!
  before_filter :control_admin
  
  private
  
  def control_admin
    return current_user.admin?
  end
  

  
end
  