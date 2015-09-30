# -*- coding: utf-8 -*-
class RegistrationsController < Devise::RegistrationsController
 
  private
 
  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :type, :profile_attributes => [:first_name, :last_name, :avatar])
  end
 
  def account_update_params
    params.require(:user).permit(:email, :password, :password_confirmation, :type, :profile_attributes => [:first_name, :last_name, :avatar])
  end  
  
end