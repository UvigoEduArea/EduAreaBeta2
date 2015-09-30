module WorkingWithBoxes
  def create_empty_data_boxes(element, wholeview)
    
    if ((element.template_id != nil) and (element.template_id != 0) and (params[:controller]=="activities" || params[:controller] == "lesson_plans"))
      boxes= Box.where("(template_id = '"+element.template_id.to_s+"' and (box_type = '"+'BSV'+"' or box_type = '"+'BTA'+"'))")
      unless boxes.blank?
         boxes.each do |box|
=begin
 Cuando se crea un elemento por primera vez deben crearse las databoxes BSV y BTA correspondientes al template
 Cuando se modifica un template ya creado, se deben crear las nuevas BSV y BTA la primera vez que se accede a la vista show          
=end
           if ( ((wholeview == true)&&(DataBox.where("element_id = '"+element.id.to_s+"' and box_id = '"+box.id.to_s+"'") == [])) || (wholeview == false) ) 
             data_box=DataBox.new
             data_box.box_id=box.id
             data_box.element_id=element.id
             data_box.type_value=box.data_type
             data_box.content_value=""
             data_box.save
           end           
         end
      end
    end  
  end
end