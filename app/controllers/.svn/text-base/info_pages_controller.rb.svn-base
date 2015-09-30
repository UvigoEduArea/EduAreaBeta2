# -*- coding: utf-8 -*-
class InfoPagesController < ApplicationController

  def infoWhatFind
    respond_to do |format|
      format.html
    end 
  end
  
  def infoResources
    respond_to do |format|
      format.html
    end 
  end
  
  def infoActivities
    respond_to do |format|
      format.html
    end
  end
  
  def infoLessonPlans
    respond_to do |format|
      format.html
    end
  end
  
  def infoWhatDo
    respond_to do |format|
      format.html
    end 
  end
  
  def infoBefore
    respond_to do |format|
      format.html
    end 
  end
  
  def infoDuring
    respond_to do |format|
      format.html
    end
  end
  
  def infoAfter
    respond_to do |format|
      format.html
    end
  end
  
  def infoContact
    respond_to do |format|
      format.html
    end
  end
  
  def infoLicenses
    respond_to do |format|
       format.html
    end 
  end 
 
  def infoTypes
    respond_to do |format|
      format.html
   end 
  end  
  
  def infoAssignLicense
    respond_to do |format|
      format.html
   end 
  end
  
  def infoCcBy
    respond_to do |format|
      format.html
   end 
  end
  
  def infoCcBySa
    respond_to do |format|
      format.html
   end 
  end
  
  def infoCompatibility
    respond_to do |format|
      format.html
   end 
  end
  
  def infoParadata
    respond_to do |format|
      format.html
   end 
  end
  
  def infoGeneral
    respond_to do |format|
      format.html
   end 
  end
  
  def infoUses
    respond_to do |format|
      format.html
   end 
  end
  
  def infoComments
    respond_to do |format|
      format.html
   end 
  end
  
  def infoFaq
    respond_to do |format|
      format.html
   end 
  end
  
  def infoVideos
    respond_to do |format|
      format.html
   end 
  end
  
  def infoNewsletter
    respond_to do |format|
      format.html
   end 
  end
  
  
  def contactByEmail
   if user_signed_in?
      @user = User.find(current_user.id)  
    else
      @user = 0    
    end
    
    @url = request.original_url.split("/contactByEmail").first + "/infoContact"; 
    
    @suggestions = params[:suggestions]
    ActionCorreo.contact_by_email(@user, @url, @suggestions).deliver
    
    respond_with do |format|
      format.html {redirect_to @url}
    end
  end
  
end