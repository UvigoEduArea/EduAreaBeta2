# -*- coding: utf-8 -*-
class BoxesController < ApplicationController
   private
  
  def validate_params
    params.require("box").permit(:template_id, :title, :description, :page_position, :position, :data_type, :vocabulary_id, :box_type)
  end
  
  public
  ##############################################################################################################################
  #Función que añade una nueva box a un determinado template
  ##############################################################################################################################
  
  def addBoxToTemplate
    @object = Box.new(validate_params)
    case @object.box_type
    when "BSV"
      @object.data_type = "Integer"
    when "BI"
      @vocabularies = Vocabulary.all()
    when "BR"
       @object.page_position = "full"
    when "BEI"
      @object.data_type = "Device"
    when "BTA"
      @object.data_type = "TextArea"
    end  
    @object.save
    
    respond_with do |format|
      format.json {render "/layouts/json/sendBox"}
    end
  end
  
  
  ##############################################################################################################################
  #Función que elimina una deteminada box de un determinado template
  ##############################################################################################################################
   
  def deleteBoxFromTemplate
    ####OJO!!!!!!
    #Si es una box con algún recurso asociado chequear que no haya nada más que hacer que lo ya hecho.
    #Es decir, tener en cuenta los vocabularios y en el caso de las BEI que incluyen recursos.
    @box = Box.find(params[:id])
    @box.destroy
    respond_to do |format|
      format.json { render :json => {data: nil} }
    end
  end
  
   def update
    
    box = Box.find(params[:id])
    
    case params[:campo]
      
      when 'title'
        box.title = params[:contenido]   
      when 'description'
        box.description = params[:contenido]
      when 'data_type'
        box.data_type = params[:contenido]
      when 'vocabulary_id'
        box.vocabulary_id = params[:contenido]
    end
    box.save
    
    
    respond_with do |format|
      
      format.json {render :json => {data: nil} }
    end
  end
  
end