# -*- coding: utf-8 -*-
class UsagesController < ApplicationController
  
  private
  
  def validate_params
    params.permit(:user_id, :object_id, :verb, :context_id, :result_id, :status)
  end

  #########################################################
  ##      PROTEGEMOS PRIMERO LAS ACCIONES CONTRA         ## 
  ##        USUARIOS QUE INTENTEN MODIFICAR DATOS        ##
  ##           DE LOS QUE NO SON PROPIETARIOS            ##
  #########################################################

  before_filter :require_owner, :only => [:getAdopt, :getAdoptWithContext, :getAdapt, :getAdaptWithContext]
  
  def require_owner
    
    @object_id = params[:element_id]
    @object = Element.find(@object_id)
    
    if user_signed_in?
      if ((@object.private == true)&&(current_user.id != @object.creator_id))
         flash[:error] = "You must be the owner in order to execute this action"
         unless params[:format] == 'json' 
           redirect_to :action => :index
         else
           respond_with do |format|
             format.json{head :forbidden}
           end
         end
      end
    else
      flash[:error] = "You must be the owner in order to execute this action"
      unless params[:format] == 'json' 
         redirect_to :action => :index
      else
         respond_with do |format|
           format.json{head :forbidden}
         end
      end 
    end
  end
      
  
  public
  
  ##############################################################################################################################
  #Funcion que devuelve las vistas de un determinado elemento, es decir, las entradas View
  ##############################################################################################################################
  
  def getViews
    element = Element.find(params[:id])
    
    views = Usage.where("verb='View' and object_id='"+params[:id].to_s+"' and user_id!='"+element.creator_id.to_s+"'").length
   
    #Esta instrucción la podríamos eliminar más adelante, está únicamente para actualizar el contador de vistas
    element.update_column(:view_count, views)
  
    users = Usage.select("distinct user_id").where("verb='View' and object_id='"+params[:id].to_s+"' and user_id!='"+element.creator_id.to_s+"'").order("user_id ASC")
    unless users.blank?
      @users = Array.new
      users.each do |user|
        if user.user_id != 0
          @users.insert(0, User.find(user.user_id))
        else
          @users.insert(0, 0)
        end
      end
    end
    
    respond_with do |format|
      format.html {render :partial => "usages/html/show_views", :object => @users, :locals => {:element => element, :views => views, :show => params[:show], :type => Element.where("(id= '"+params[:id]+"')").first.type.downcase} }
    end
  end
  
  ##############################################################################################################################
  #Funcion que devuelve las vistas de un determinado elemento, es decir, las entradas View
  ##############################################################################################################################
  
  def getCopies
    copies = Usage.where("verb='Copy' and object_id='"+params[:id].to_s+"'")
    includes = Usage.where("verb='Include' and object_id='"+params[:id].to_s+"'")
    number_copies = 0
    number_includes = 0
    
    unless copies.blank?
      copies_elements = Array.new
      copies.each do |copy|
        element = Element.find(copy.result_id)
        if !element.removed
          copies_elements.insert(0, element)
          number_copies +=1
        end
      end
    end
    
    unless includes.blank?
      includes_elements = Array.new
      includes.each do |include|
        element_context = Element.find(include.context_id)
        element = Element.find(include.result_id)
        if !element.removed and !element_context.removed
          includes_elements.insert(0, element_context)
          number_includes +=1 
        end  
      end
    end
    
    copies_count = number_copies + number_includes
    element = Element.find(params[:id])
    element.update_column(:copy_count, copies_count)
    
    respond_with do |format|
      format.html {render :partial => "usages/html/show_copies", :locals => {:number_copies => number_copies, :number_includes => number_includes, :copies_elements => copies_elements, :includes_elements => includes_elements, :show => params[:show], :type => Element.where("(id= '"+params[:id]+"')").first.type.downcase} }
    end
  end
    
end
