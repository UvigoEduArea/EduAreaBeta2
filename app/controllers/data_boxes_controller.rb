# -*- coding: utf-8 -*-
class DataBoxesController < ApplicationController
   private
  
  def validate_params
    params.permit(:element_id, :box_id, :position, :type_value, :content_value)
  end
  
  public
  ##############################################################################################################################
  #Función que añade un nuevo dato asociado con una determinada box
  ##############################################################################################################################
  api :POST, "/dataBoxes/addDataToBox.json", "Crea una nueva entrada en la tabla de data_boxes asociada a una determinada box y devuelve el identificador de esa nueva entrada"
  param :element_id, Fixnum, :desc =>"Id del element al que estará asociado el dato", :required => true
  param :box_id, Fixnum, :desc =>"Id de la box en la que se incluirá el nuevo dato", :required => true
  param :position, Fixnum, :desc => "Posición del dato dentro de la box", :required => true
  param :type_value, Fixnum, :desc => "Indica si es un vocabulario, un recurso, o un valor del dato, por ejemplo un identificador", :required => false
  param :content_value, String, :desc => "Descripción, texto, asociada a la entrada", :required => false
  example '[
    {
        "id": 2
    }
]'
  description <<-EOS
  ===Description
    En el caso de BSV: data_type incluirá el tipo de dato que puede ser integer, string, float o date, y text_value incluirá el propio dato, el valor.
    Para las BEI: data_type indicará el tipo de recurso del que se trata y en text_value se incluirá el identificador del recurso en la tabla element.
    En las BI: data_type indica el id del vocabulario en la tabla de vocabularios y text_value contiene el término con ese id de la tabla de vocabularios.
    Ahora mismo, los templates ya no tiene BEI, y no se itliza esta función pero puede ocurrir que en un futuro "haga falta"
  EOS

  def addDataToBox
    #En el caso de que se trate de un vocabulario el parámetro content_value no existirá y habrá que buscar en la tabla de vocabulario el 
    #término correspondiente al identificador de vocabulario contenido en type_value
    vocabulary_item=false
    
    element= Element.where("(id= '"+params[:element_id]+"')").first
    #element.updated_at = Time.now
    #element.save
    ReloadElementFields.reload_updated_at(element)   
    
    case params[:type]
      
      when "Free_Text"
        params[:content_value]=""
        @object= DataBox.new(validate_params)
        @object.save
        respond_to do |format|
          format.json { render "layouts/json/sendObjectId"}
          format.html { render :partial=> "layouts/html/select_tag", :locals=>{:free_text => true}}
        end
      
      when "Vocabulary"
        vocabularyterm= VocabularyTerm.where("(id= '"+params[:type_value]+"')")
        params[:content_value] = vocabularyterm.first.term
        @object = DataBox.new(validate_params)
        @object.save
        respond_to do |format|
          format.json { render "layouts/json/sendObjectId"}
          box=Box.find(params[:box_id])
          @vocabularies = VocabularyTerm.where("id not in (select type_value from data_boxes DB, boxes B where DB.box_id='"+params[:box_id]+"' and DB.element_id='"+params[:element_id]+"' and B.box_type='BI') and (vocabulary_terms.element_id = '"+box.vocabulary_id.to_s+"')")
          format.html { render :partial=> "layouts/html/select_tag"}
        end
      
      #when "Element_From_Popup"
        #element_to_clone=Element.find(params[:content_value]);
        #valido = CompatibilityChart.check_compatibility(params[:final_vector],Element.find(params[:content_value]).right_id,Element.find(params[:element_id]).right_id,element_to_clone.creator_id,current_user.id);
        #if valido
          #@new_element_cloned = element_to_clone.clone_element_data_box(current_user.id, params[:element_id], session.id)
          #@object = DataBox.new(validate_params)
          #@object.content_value = @new_element_cloned.id
          #@object.save
        #end
        #respond_to do |format|
          #if valido
            #format.json { render "layouts/json/sendObjectId"}
            #format.html { render :partial=> "layouts/html/mini_view", :object => @new_element_cloned, :locals => {:recipient => Hash[@new_element_cloned.id, @object], :created => true, :table_view => false} }
          #else
            #format.html { head :forbidden }
          #end
        #end 
    end
 end
  
  
  ##############################################################################################################################
  #Función que elimina un deteminado dato de una determinada box
  ##############################################################################################################################
  api :DELETE, "/dataBoxes/deleteDataFromBox.json", "Elimina un determinado dato de la tabla data_boxes asociado a una box en concreto"
  param :data_id, Fixnum, :desc =>"Id del dato que se quiere eliminar", :required => true
    description <<-EOS
  ===Description
    Esta funcion elimina un determinado dato, pasada por parametro, que está asociado a una box. Si todo ha funcionado correctamente, el método devuelve OK.
  EOS
   
  def deleteDataFromBox
    p "DELETE DATA FROM BOX"
    @dataBox = DataBox.find(params[:data_id])
    box = Box.find(@dataBox.box_id)
    box_type = box.box_type
    element_id = @dataBox.element_id.to_s;
    if box_type == 'BEI'
      element = Element.find(@dataBox.content_value)
      element.removed = true
      element.save
    end
    @dataBox.destroy
    
    if (box_type == 'BI')
      @select_tag = true
      @vocabularies = VocabularyTerm.where("id not in (select type_value from data_boxes DB, boxes B where DB.box_id='"+box.id.to_s+"' and DB.element_id='"+element_id.to_s+"' and B.box_type='BI') and (vocabulary_terms.element_id = '"+box.vocabulary_id.to_s+"')")
    end
    
    element= Element.where("(id= '"+element_id+"')").first
    #element.updated_at = Time.now
    #element.save
    ReloadElementFields.reload_updated_at(element)   
    
    vector = Array.new
    (0..4).each do |n|
      vector[n] = '0'
    end
    
    vector1 = Array.new
    (0..5).each do |n|
      vector1[n] = '0'
    end
    bandera = false
    children = Element.where('parent_id = '+ element_id +' and removed = 0 and type != "TechnicalSetting" and type != "EducationalSetting"')
    children.each do |child|
      case child.right_id
          when 1
            vector[3] = '1'
          when 2
            vector[2] = '1'
          when 3
            vector[1] = '1'
          when 4
            vector[0] = '1'
          when 7
            vector[4] = '1'
          when 5
            bandera = true
            vector1[0] = '1'
          when 6
            bandera = true
            vector1[0] = '1'
            vector1[1] = '1'
      end
    end
    
    vector = vector.join
    vector1 = vector1.join
    
    respond_to do |format|
    if bandera == false
        format.json { render :json => {licenses: vector}}
        format.html { render :partial=>"layouts/html/delete_element_from_box" }
    else
        format.json { render :json => {licenses: vector1}}
        format.html { render :partial=>"layouts/html/delete_element_from_box" }
    end
    
   end
  end
end