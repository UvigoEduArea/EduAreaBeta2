# -*- coding: utf-8 -*-
class TemplatesController < ElementsController
  
  before_filter :authenticate_user!
  before_filter :control_admin, :except => :index 
  
  private
  
  def control_admin
    unless current_user.admin?
      redirect_to :controller => :home, :action => :index
    end
  end
  
  public
  
  ##########################################################################
  ##                      TEMPLATES UPDATE                                ##
  ##########################################################################
  def update
    template = Template.find(params[:id])
   
    case params[:campo]
      
      when 'title'
        template.title = params[:contenido]   
      when 'description'
        template.description = params[:contenido]
      when 'private'
        template.private = params[:contenido]
      when 'image'
        template.image = params[:contenido]
      when 'imagenone'
        template.image = nil
      when 'content_value'
        data_box = DataBox.find(params[:data_box])
        data_box.content_value = params[:contenido]
        data_box.save
      
    end
    @object=template.save
    respond_with do |format|
      format.json { render :json => {:url => template.image.url} }
    end
  end
end
