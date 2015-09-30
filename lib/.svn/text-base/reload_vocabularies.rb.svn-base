module ReloadVocabularies
  
  #Función que calcula los vocabularios dentro de un educational setting que debe tener un select concreto, el de tipo type.
  def self.reload_educational_vocabularies(element, type)
   
    options = Hash.new 
     #Se calculan los vocabularios de cada tipo que ya tiene el setting
    stored_el = element.settings.where("field_type='EducationalLevel'")
    id_el=""
    unless stored_el.blank?
      stored_el.each do |el|
        if id_el==""
          id_el= "="+el.field_value.to_s
        else
          id_el=id_el+" or esr.educational_level="+el.field_value.to_s
        end
      end
    end
    
    stored_grade = element.settings.where("field_type='Grade'")
    id_grade=""
    unless stored_grade.blank?
      stored_grade.each do |grade|
        if id_grade==""
          id_grade= "="+grade.field_value.to_s
        else
          id_grade=id_grade+" or esr.grade="+grade.field_value.to_s
        end
      end
    end
    
    stored_ka = element.settings.where("field_type='KnowledgeArea'")
    id_ka=""
    unless stored_ka.blank?
      stored_ka.each do |ka|
        if id_ka==""
          id_ka= "="+ka.field_value.to_s
        else
          id_ka=id_ka+" or esr.knowledge_area="+ka.field_value.to_s
        end
      end
    end
    
    stored_objec = element.settings.where("field_type='Objectives'")
    id_objec=""
    unless stored_objec.blank?
      stored_objec.each do |objec|
        if id_objec==""
          id_objec= "="+objec.field_value.to_s
        else
          id_objec=id_objec+" or esr.objetives="+objec.field_value.to_s
        end
      end
    end
    
    stored_block = element.settings.where("field_type='Block'")
    id_block=""
    unless stored_block.blank?
      stored_block.each do |block|
        if id_block==""
          id_block= "="+block.field_value.to_s
        else
          id_block=id_block+" or esr.block="+block.field_value.to_s
        end
      end
    end
    
    stored_content = element.settings.where("field_type='Contents'")
    id_content=""
    unless stored_content.blank?
      stored_content.each do |content|
        if id_content==""
          id_content= "="+content.field_value.to_s
        else
          id_content=id_content+" or esr.content="+content.field_value.to_s
        end
      end
    end
    
    stored_competences = element.settings.where("field_type='Competences'")
    id_competences=""
    unless stored_competences.blank?
      stored_competences.each do |competence|
        if id_competences==""
          id_competences= "="+competence.field_value.to_s
        else
          id_competences=id_competences+" or esr.competences="+competence.field_value.to_s
        end
      end
    end
    
    #Dependiendo del type del select, se actualizan los vocabularios teniendo unas cosas u otras en mente.
    case type
    when "EducationalLevel"
      possible_options = VocabularyTerm.where("id in (select educational_level from educational_setting_relations esr where (esr.educational_level) and (esr.grade"+id_grade+") and (esr.knowledge_area"+id_ka+") and (esr.objetives"+id_objec+") and (esr.block"+id_block+") and (esr.content"+id_content+") and (esr.competences"+id_competences+") ) and id not in (select field_value from settings where settings.field_type='EducationalLevel' and settings.element_id="+element.id.to_s+")")
    when "Grade"
      possible_options = VocabularyTerm.where("id in (select grade from educational_setting_relations esr where (esr.educational_level"+id_el+") and (esr.grade) and (esr.knowledge_area"+id_ka+") and (esr.objetives"+id_objec+") and (esr.block"+id_block+") and (esr.content"+id_content+") and (esr.competences"+id_competences+") ) and id not in (select field_value from settings where settings.field_type='Grade' and settings.element_id="+element.id.to_s+")")
    when 'KnowledgeArea'
      possible_options = VocabularyTerm.where("id in (select knowledge_area from educational_setting_relations esr where (esr.educational_level"+id_el+") and (esr.grade"+id_grade+") and (esr.knowledge_area) and (esr.objetives"+id_objec+") and (esr.block"+id_block+") and (esr.content"+id_content+") and (esr.competences"+id_competences+") ) and id not in (select field_value from settings where settings.field_type='KnowledgeArea' and settings.element_id="+element.id.to_s+")")
    when 'Objectives'
      possible_options = VocabularyTerm.where("id in (select objetives from educational_setting_relations esr where (esr.educational_level"+id_el+") and (esr.grade"+id_grade+") and (esr.knowledge_area"+id_ka+") and (esr.objetives) and (esr.block"+id_block+") and (esr.content"+id_content+") and (esr.competences"+id_competences+") ) and id not in (select field_value from settings where settings.field_type='Objectives' and settings.element_id="+element.id.to_s+")")
    when "Block"
      possible_options = VocabularyTerm.where("id in (select block from educational_setting_relations esr where (esr.educational_level"+id_el+") and (esr.grade"+id_grade+") and (esr.knowledge_area"+id_ka+") and (esr.objetives"+id_objec+") and (esr.block) and (esr.content"+id_content+") and (esr.competences"+id_competences+") ) and id not in (select field_value from settings where settings.field_type='Block' and settings.element_id="+element.id.to_s+")")
    when "Contents"
      possible_options = VocabularyTerm.where("id in (select content from educational_setting_relations esr where (esr.educational_level"+id_el+") and (esr.grade"+id_grade+") and (esr.knowledge_area"+id_ka+") and (esr.objetives"+id_objec+") and (esr.block"+id_block+") and (esr.content) and (esr.competences"+id_competences+") ) and id not in (select field_value from settings where settings.field_type='Contents' and settings.element_id="+element.id.to_s+")")
    when "Competences"
      possible_options = VocabularyTerm.where("id in (select competences from educational_setting_relations esr where (esr.educational_level"+id_el+") and (esr.grade"+id_grade+") and (esr.knowledge_area"+id_ka+") and (esr.objetives"+id_objec+") and (esr.block"+id_block+") and (esr.content"+id_content+") and (esr.competences) ) and id not in (select field_value from settings where settings.field_type='Competences' and settings.element_id="+element.id.to_s+")")
    end
    
    options[type] = possible_options
   
    return options

  end

end