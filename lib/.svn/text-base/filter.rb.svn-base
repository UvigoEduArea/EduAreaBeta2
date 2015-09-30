module Filter
  
  class FilterObject
    def initialize(params)
      @@parametros=params
      @@types_resource=['Application', 'Device', 'Event', 'Content', 'Collaborator']
      @@elements=[]
    end
    
    def getOutput
      return @@elements
    end
    
    def filter_by_text
      #Por título y/o descripción
      unless @@parametros[:search_text].blank?
        @@elements = @@elements.where("title like '%"+@@parametros[:search_text]+"%' or description like '%"+@@parametros[:search_text]+"%'").page(@@parametros[:page]).per(20);
      end
    end
    
    def filter_by_user_text
      #Por usuario propietario
      unless @@parametros[:search_user].blank?
        @@elements = @@elements.where("creator_id in (select user_id from profiles where (profiles.first_name like '%"+@@parametros[:search_user]+"%' or profiles.last_name like '%"+@@parametros[:search_user]+"%'))").page(@@parametros[:page]).per(20);
      end
    end
    
    def filter_by_language
      unless @@parametros[:language_search].blank?
           @@elements = Element.where('language IN (?)', @@parametros[:language_search]).where("(removed = false and library = true) and (private = false or (private = true and creator_id = "+@@parametros[:current_user].to_s+"))").order("updated_at DESC").page(@@parametros[:page]).per(20)           
      end
    end
    
    def filter_by_keyword
      #Por keywords
      unless @@parametros[:search_keyword].blank?
        @@elements = @@elements.where("id in (select element_id from keywords where (keywords.keyword like '%"+@@parametros[:search_keyword]+"%'))").page(@@parametros[:page]).per(20); 
      end
    end 
    
    def filter_by_type_element
      if @@parametros[:type].blank?
        if @@parametros[:controller]!="home"
          @@parametros[:type]=Array.new([@@parametros[:controller].singularize.camelize])
        else
          @@parametros[:type]=Array.new(['Resource', 'Activity', 'LessonPlan', 'Experience', 'Board'])
        end
      end
      
      if @@parametros[:type].include?('Resource')
        @@parametros[:type].delete('Resource')
        @@parametros[:type].insert(1, 'Application', 'Device', 'Content', 'Collaborator', 'Event')
      end
  
      unless @@parametros[:type].blank?
        if @@parametros[:logged]=='true'      #SI EL USUARIO ESTÁ LOGUEADO, todos los elementos suyos y los públicos de los demás
           @@elements = Element.where('type IN (?)', @@parametros[:type]).where("(removed = false and library = true) and (private = false or (private = true and creator_id = "+@@parametros[:current_user].to_s+"))").order("updated_at DESC").page(@@parametros[:page]).per(20)           
        else #EL USUARIO NO ESTÁ LOGUEADO, ENTONCES...
          @@elements = Element.where('type IN (?)', @@parametros[:type]).where("(removed = false and library = true) and (private = false)").order("updated_at DESC").page(@@parametros[:page]).per(20)
        end
      end
    end
    
    def filter_by_type_user
      case @@parametros[:type_user]
      when "My elements"
        @@elements = @@elements.where("(removed = false and library = true) and (creator_id = "+@@parametros[:current_user].to_s+")").order("updated_at DESC").page(@@parametros[:page]).per(20)
      when "Shared with me"
        @@elements = Element.where("id in (select experience_id from shared_experiences where user_id = "+@@parametros[:current_user].to_s+")").order("updated_at DESC").page(@@parametros[:page]).per(20)
      end
    end
    
    def filter_by_CS_simple
     unless @@parametros[:curricular_setting].blank?
       #Educational_Level
       unless @@parametros[:curricular_setting]['educational_level'].blank?
          unless @@elements.blank?
            elements_es = []
            @@elements.each do |element|
              if (element.type!='Application')&&(element.type!='Device')&&(element.type!='Event')&&(element.type!='Collaborator')&&(element.type!='Content')&&(element.type!='Board')&&(element.type!='Experience')
                unless element.educational_setting.blank?
                  element_settings = element.educational_setting.settings.where("field_type='EducationalLevel' and field_value in (select id from vocabulary_terms where term IN (?))",@@parametros[:curricular_setting][:educational_level])
                  if element_settings != []
                    aux = Element.find(element_settings.first.element_id)
                    elements_es.insert(1, Element.find(aux.parent_id).id)
                  end
                end
              end            
            end
            @@elements = Element.where("id IN (?)",elements_es).page(@@parametros[:page]).per(20)
          end 
        end
        
        #Knowledge_Area
        unless @@parametros[:curricular_setting]['knowledge_area'].blank?
          unless @@elements.blank?
            elements_es = []
            @@elements.each do |element|
              if (element.type!='Application')&&(element.type!='Device')&&(element.type!='Event')&&(element.type!='Collaborator')&&(element.type!='Content')&&(element.type!='Board')&&(element.type!='Experience')
                unless element.educational_setting.blank?
                  element_settings = element.educational_setting.settings.where("field_type='KnowledgeArea' and field_value in (select id from vocabulary_terms where term IN (?))",@@parametros[:curricular_setting][:knowledge_area])
                  if element_settings != []
                    aux = Element.find(element_settings.first.element_id)
                   elements_es.insert(1, Element.find(aux.parent_id).id)
                  end
                end
              end              
            end
            @@elements = Element.where("id IN (?)",elements_es).page(@@parametros[:page]).per(20)
          end
        end
      end
    end
    
    def filter_by_CS
      #En esta función se calcularán las restantes opciones del curricular_setting
      unless @@parametros[:curricular_setting].blank?
        #Grade
        unless @@parametros[:curricular_setting]['grade'].blank?
          unless @@elements.blank?
            elements_es = []
            @@elements.each do |element|
              if (element.type!='Application')&&(element.type!='Device')&&(element.type!='Event')&&(element.type!='Collaborator')&&(element.type!='Content')&&(element.type!='Board')&&(element.type!='Experience')
                unless element.educational_setting.blank?
                  element_settings = element.educational_setting.settings.where("field_type='Grade' and field_value in (select id from vocabulary_terms where term IN (?))",@@parametros[:curricular_setting][:grade])
                  if element_settings != []
                    aux = Element.find(element_settings.first.element_id)
                    elements_es.insert(1, Element.find(aux.parent_id).id)
                  end
                end
              end            
            end
            @@elements = Element.where("id IN (?)",elements_es).page(@@parametros[:page]).per(20)
          end 
        end
      end
    end
    
    def filter_by_TS
      unless @@parametros[:technical_setting].blank?
       #SO: Sistema Operativo
       unless @@parametros[:technical_setting]['SO'].blank?
          unless @@elements.blank?
            elements_ts = []
            @@elements.each do |element|
              if (element.type!='Application')&&(element.type!='Device')&&(element.type!='Event')&&(element.type!='Collaborator')&&(element.type!='Content')&&(element.type!='Board')&&(element.type!='Experience')
                unless element.technical_setting.blank?
                  element_settings = element.technical_setting.settings.where("field_type='SO' and field_value in (select id from vocabulary_terms where term IN (?))",@@parametros[:technical_setting][:SO])
                  if element_settings != []
                    aux = Element.find(element_settings.first.element_id)
                    elements_ts.insert(1, Element.find(aux.parent_id).id)
                  end
                end
              end            
            end
            @@elements = Element.where("id IN (?)",elements_ts).page(@@parametros[:page]).per(20)
          end 
        end
        
        #LMS
        unless @@parametros[:technical_setting]['LMS'].blank?
          unless @@elements.blank?
            elements_ts = []
            @@elements.each do |element|
              if (element.type!='Application')&&(element.type!='Device')&&(element.type!='Event')&&(element.type!='Collaborator')&&(element.type!='Content')&&(element.type!='Board')&&(element.type!='Experience')
                unless element.technical_setting.blank?
                  element_settings = element.technical_setting.settings.where("field_type='LMS' and field_value in (select id from vocabulary_terms where term IN (?))",@@parametros[:technical_setting][:LMS])
                  if element_settings != []
                    aux = Element.find(element_settings.first.element_id)
                   elements_ts.insert(1, Element.find(aux.parent_id).id)
                  end
                end
              end              
            end
            @@elements = Element.where("id IN (?)",elements_ts).page(@@parametros[:page]).per(20)
          end
        end
        
        #Internet
        unless @@parametros[:technical_setting]['Internet'].blank?
          unless @@elements.blank?
            elements_ts = []
            @@elements.each do |element|
              if (element.type!='Application')&&(element.type!='Device')&&(element.type!='Event')&&(element.type!='Collaborator')&&(element.type!='Content')&&(element.type!='Board')&&(element.type!='Experience')
                unless element.technical_setting.blank?
                  element_settings = element.technical_setting.settings.where("field_type='Internet' and field_value in (select id from vocabulary_terms where term IN (?))",@@parametros[:technical_setting][:Internet])
                  if element_settings != []
                    aux = Element.find(element_settings.first.element_id)
                   elements_ts.insert(1, Element.find(aux.parent_id).id)
                  end
                end
              end              
            end
            @@elements = Element.where("id IN (?)",elements_ts).page(@@parametros[:page]).per(20)
          end
        end
      end
    end   
   
    def filter_simple
      filter_by_type_element
      filter_by_type_user
      filter_by_text
      filter_by_user_text
      filter_by_language
      filter_by_keyword
      filter_by_CS_simple
    end 
    
    def filter_advanced
      filter_simple
      filter_by_CS
      filter_by_TS
    end 
        
  end
  
end