# -*- coding: utf-8 -*-
class UsersController < ApplicationController
  
  private
  
  def validate_params
    
    # la siguiente sentencia obliga a que en el formulario esté la key user, que esta tenga la key profile
    # y permite esos tres campos
    params.require(:user).require(:profile).permit(:first_name, :last_name)#, :avatar)
    
  end
  
  #########################################################
  ##      PROTEGEMOS PRIMERO LAS ACCIONES CONTRA         ## 
  ##        USUARIOS QUE INTENTEN MODIFICAR DATOS        ##
  ##           DE LOS QUE NO SON PROPIETARIOS            ##
  #########################################################

  before_filter :require_owner, :only => [:update, :edit, :show]
  
  def require_owner
    
    @object_id = params[:id]
    @object = User.find(@object_id)
    
    case params[:action]
    when 'update', 'edit'
      if user_signed_in?
        unless current_user.id == @object.id
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
    else
      unless user_signed_in? #Para los casos de index y show
        flash[:error] = "You must be the owner in order to execute this action"
        unless params[:format] == 'json' 
          redirect_to :controller => :"devise/sessions", :action => :new
        else
          respond_with do |format|
            format.json{head :forbidden}
          end
        end
      end
    end
  end     
  
  
  public
  
  def index
    @user = User.find(current_user.id)
     respond_to do |format|
      format.html # index.html.erb
      format.json { render json: {:id => @user.id, :email => @user.email, :type => @user.type} }
    end
  end
  
 
  def show
    @user = User.find(params[:id])
    respond_to do |format|
      format.html {render action: "show", :locals => {:created => (!current_user.blank? && @user.profile.user_id == current_user.id) ? true:false}} # index.html.erb
      format.json { render json: @user }
    end
    
  end
  
  def edit
    @user = current_user
   
     respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @user }
    end
  end
  
  def patch
    user = User.find(params[:user])
    
    case params[:campo]
    when 'first_name'
      user.profile.first_name = params[:contenido]
    when 'last_name'
      user.profile.last_name = params[:contenido]
    when "image"
      user.profile.avatar = params[:avatar]
    when 'imagenone'
        user.profile.avatar = nil
    when 'private'
      user.profile.private = params[:contenido]
    when 'licenses'
        #CC-BY
        if (params[:commercial]  == "1") and (params[:derivative] == "1") 
          user.profile.right_id = "1"
        end
        #CC-BY-SA
        if (params[:commercial]  == "1") and (params[:derivative] == "2") 
          user.profile.right_id = "2"
        end
        #CC-BY-NC
        if (params[:commercial]  == "0") and (params[:derivative] == "1") 
          user.profile.right_id = "3"
        end
        #CC-BY-NC-SA
        if (params[:commercial]  == "0") and (params[:derivative] == "2") 
          user.profile.right_id = "4"
        end
        #CC-BY-ND
        if (params[:commercial]  == "1") and (params[:derivative] == "0") 
          user.profile.right_id = "5"
        end
        #CC-BY-NC-ND
        if (params[:commercial]  == "0") and (params[:derivative] == "0") 
          user.profile.right_id = "6"
        end
        #CC0 Public Domain
        if ((params[:commercial]  == "1") and (params[:derivative] == "1")) and (params[:condition] == "2")
          user.profile.right_id = "7"
         
        end
    when 'language'
      user.profile.language = params[:contenido]
      params.merge({:locale => params[:contenido]})
    end
    
    user.save
    #@license = user.profile.license
    @license = Hash.new 
    @license["license_icon"] = user.profile.license.license_icon
    respond_with do |format|
      if params[:campo] != "imagenone"
        #format.json { render :json => {:url => user.profile.avatar.url} }
        #format.json { render params[:campo] == "licenses" ? @license : {:url => user.profile.avatar.url}  }
        if params[:campo]== "licenses"
          format.json { render :json => @license }
        else 
          format.json { render :json => {:url => user.profile.avatar.url} }
        end
      else
        format.json {render nil}
      end
    end
  end
  
  def update
    @user = current_user
    
    respond_to do |format|
      if @user.profile.update_attributes(validate_params)
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
   end
   
   def getAllUsers
     @profiles = Profile.all 
     
     respond_with do |format|
       format.json {render "/users/json/sendAllUserInfo"}
     end
   end
   
   def setDefaultTemplate
     template = Element.find(params[:element_id])
     profile = User.find(params[:id]).profile
     if template.type == "ActivityTemplate"
       profile.activity_default = template.id
     else
       profile.lesson_plan_default = template.id
     end
     profile.save
    
     respond_with do |format|
       format.json { render :json => {title: template.title, template_type: template.type}}
     end
   end
   
end


