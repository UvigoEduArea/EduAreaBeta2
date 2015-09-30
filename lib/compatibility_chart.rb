module CompatibilityChart

  ###########################################################################
  #        Función para comprobar compatibilidad de licencias               #
  ###########################################################################
  def self.check_compatibility(final_vector,right_id,parent_right_id,creator_id,current_user)
    p "Checking Compatibility"
    if (final_vector.length < 6) && (parent_right_id != 5) && (parent_right_id != 6)
        unless parent_right_id == 8 #Caso normal
          license = License.select(:name).where(:id => parent_right_id).first.name
          comp = Compatibility.where(license+" = 1 and vector = "+final_vector)
        else #Caso unknown final license
          if check_license_true(final_vector, false)
            return true
          else
            comp = "" 
          end     
          
        end
        
        if comp.blank? #ESTO SE UTILIZA PARA EL CASO NORMAL
          p " NOT COMPATIBLE"
          return false
        else
          p "COMPATIBLE"
          return true
        end
     #Si es ND o NC-ND
    else
       p "ES ND o NC-ND"
       #Comprobamos que las licencias sean las mismas pero que además el creador del recurso (creator_id) sea el mismo que el creador de la actividad (current_user). 
       #En cualquier otro caso, las licencias ND, NC-ND no son compatibles con ninguna licencia.
       if (creator_id == current_user) && (right_id == parent_right_id)
          return true
       else
          return false
       end
    end
  end
  
  def self.check_license_true(vector, updating) #updating signifca que vengo de un update del controller y no de check_compatibility 
    comp = Compatibility.where(:vector => vector).first
    comp.attributes.each do |attr|
      p attr
      if attr[0] != "id" && attr[0] != "vector"
      
        if attr[1] == 1
          unless updating
            return true
          else
            return attr[0]
          end
        end
        
      end
    end
    return false
  end
  
  ############################################################################
  #Creamos vector con las licencias de los elementos que tiene el lesson plan#
  ############################################################################
  def self.create_vectors(activities)
    vector_hash = Hash.new
    activities.each do |x|
      
    vector = Array.new
    (0..4).each do |n|
        vector[n] = '0'
    end
    
    vector1 = Array.new
    (0..5).each do |n|
        vector1[n] = '0'
    end
    
    bandera = false  
    children = Element.where('parent_id = '+ x.id.to_s + ' and removed = 0 and type != "TechnicalSetting" and type != "EducationalSetting"')
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
     p "vector in create_vector"
     p vector
     if bandera == false
        vector_hash[x.id.to_s]=vector
     else
       vector_hash[x.id.to_s]=vector1
     end
     #p vector
    end
    p vector_hash
    p "salgo de vector create"
    return vector_hash
  end
  
  ###########################################################################################################################################################################
  #Función para crear el vector de licencias, cuando la actividad a añadir es nueva en un lesson plan, para luego poder llamar a la función de compatibilidad de licencias  #
  #check_compatibility(final_vector,right_id,creator_id,current_user) para ver si la licencia que tiene la actividad nueva por defecto es compatible con la del lesson plan #
  ###########################################################################################################################################################################  
  def self.new_element_compatibility(right_id,license_id,final_vector)
    p right_id
    
    case right_id
        #CC-BY-NC-SA
        when 4 
          aux = "10000"
        #CC-BY-NC
        when 3
          p "NC"
          aux = "01000"
        #CC-BY-SA
        when 2
          aux = "00100"
        #CC-BY
        when 1
          aux = "00010"
        #CC0
        when 7
          aux = "00001"
        #CC-BY-ND
        when 5
          aux = "100000"
        #CC-BY-NC-ND
        when 6
          aux = "110000"
    end         
    #Hacemos or de ambos vectores en decimal y pasamos el resultado a string binario
    final_vector=(final_vector.to_i(2) | aux.to_i(2)).to_s(2)
    p "new activity comp"
   
    if (final_vector.length < 5)
        if final_vector.length == 4
          final_vector = "0" + final_vector;
        end
        if final_vector.length == 3
          final_vector = "00" + final_vector;
        end
        if final_vector.length == 2
          final_vector = "000" + final_vector;
        end
        if final_vector.length == 1
          final_vector = "0000" + final_vector;
        end
      end
     #p final_vector
    return final_vector
  end
  
  #######################################################################################################################
  #                                             Construimos right_id                                                    #
  #######################################################################################################################
  def self.construct_right_id(commercial,derivative,condition)
    #CC-BY
    if (commercial  == "1") and (derivative == "1") and (condition == "1")
        right_id = "1"
    end
    #CC-BY-SA
    if (commercial  == "1") and (derivative == "2") and (condition == "1")
        right_id = "2"
    end
    #CC-BY-NC
    if (commercial  == "0") and (derivative == "1") and (condition == "1")
        right_id = "3"
    end
    #CC-BY-NC-SA
    if (commercial  == "0") and (derivative == "2") and (condition == "1")
        right_id = "4"
    end
    #CC-BY-ND
    if (commercial  == "1") and (derivative == "0") and (condition == "1")
        right_id = "5"
    end
    #CC-BY-NC-ND
    if (commercial  == "0") and (derivative == "0") and (condition == "1")
        right_id = "6"
    end
    #CC0
    if ((commercial  == "1") and (derivative == "1")) and (condition == "2")
        right_id = "7"
    end
    p "construct right_id " + right_id
    return right_id    
  end
  
  
  #######################################################################################################################
  #               Comprobamos si la licencia de la actividad/LP es compatible con los recursos que ya tiene                #
  #######################################################################################################################
  def self.license_change_compatibility(commercial,derivative,condition,vector_licenses,creator_id,current_user)
    #vector = mifuncionmolonaquecreaelvector()
    
    p "vector_licenses: " + vector_licenses
    
    #CC-BY
    if (commercial  == "1") and (derivative == "1") and (condition == "1")
        right_id = "1"
    end
    #CC-BY-SA
    if (commercial  == "1") and (derivative == "2") and (condition == "1")
        right_id = "2"
    end
    #CC-BY-NC
    if (commercial  == "0") and (derivative == "1") and (condition == "1")
        right_id = "3"
    end
    #CC-BY-NC-SA
    if (commercial  == "0") and (derivative == "2") and (condition == "1")
        right_id = "4"
    end
    #CC-BY-ND
    if (commercial  == "1") and (derivative == "0") and (condition == "1")
        right_id = "5"
    end
    #CC-BY-NC-ND
    if (commercial  == "0") and (derivative == "0") and (condition == "1")
        right_id = "6"
    end
    #CC0
    if ((commercial  == "1") and (derivative == "1")) and (condition == "2")
        right_id = "7"
    end
    p right_id    
    if (vector_licenses == "00000" or vector_licenses == "000000")
        p "No hay recursos"
        return true
    else
       if vector_licenses.length < 6       
            license = License.select(:name).where(:id => right_id).first.name
            if (license.to_s != "ND") && (license.to_s != "NC_ND")
                comp = Compatibility.where(license+" = 1 and vector = "+vector_licenses)
                p comp
                if comp.blank?
                    p " NOT COMPATIBLE"
                    return false
                else
                    p "COMPATIBLE"
                    return true
                end
            else
              return false
            end  
      else
            case right_id
            when "5"
              p "ND"
              if vector_licenses == "100000"
                 p "compatible nd"
                return true
              else
                p "not comp nd"
                return false
              end
            when "6"
              p "NC_ND"
              if vector_licenses == "110000"
                p "compatible nc_nd"
                return true
              else
                p "not comp nc_nd"
                return false
              end
            end 
       end
    end
  end
  
  #########################################################################################################
  #                       Comprobar licencia cuando se clona un elemento                                  #
  #########################################################################################################
  def self.licencia_clonar_elemento (right_id,commercial,derivative,condition)
    #right_id => es el right_id de la licencia del elemento a clonar
    
    #construimos right_id de la licencia que queremos para la modificación
    new_right_id=construct_right_id(commercial,derivative,condition)
    #license se corresponde a la licencia del elemento original
    original_license = License.select(:name).where(:id => right_id).first.name
    p "original_license " + original_license
    
    if (right_id != 5) && (right_id != 6) 
        modified_license = License.select(:name).where(:id => new_right_id).first.name
        p "modified_license " + modified_license
        
        comp = CloneLicense.select(modified_license).where(:original => original_license).first
        
        unless comp.blank?
          if comp[modified_license]==1
            p "compatible clonacion"
            return true
          else
            return false
          end
        else
          return false
        end
    else
        return false
    end
  end
  
  #########################################################################################################
  #                       Asignar url de licencia Creative Commons a la licencia elegida                  #
  #########################################################################################################
  def self.url_licencia(right_id, language)
    
    p "vvvvvvvvvvvvvvvvvv"
       
    case right_id
      #CC-BY
      when 1
          case language
          when "gl"
            url = "http://creativecommons.org/licenses/by/4.0/deed.gl"
          when "es"
            url = "http://creativecommons.org/licenses/by/4.0/deed.es_ES/"
          when "en"
            url = "http://creativecommons.org/licenses/by/4.0/"
          when "pt"
            url = "http://creativecommons.org/licenses/by/4.0/deed.pt"
          end
          
      when 2
          case language
          when "gl"
            url = "http://creativecommons.org/licenses/by-sa/4.0/deed.gl"
          when "es"
            url = "http://creativecommons.org/licenses/by-sa/4.0/deed.es_ES"
          when "en"
            url = "http://creativecommons.org/licenses/by-sa/4.0/"
          when "pt"
            url = "http://creativecommons.org/licenses/by-sa/4.0/deed.pt"
          end
        
      when 3
          case language
          when "gl"
            url = "http://creativecommons.org/licenses/by-nc/4.0/deed.gl"
          when "es"
            url = "http://creativecommons.org/licenses/by-nc/4.0/deed.es_ES"
          when "en"
            url = "http://creativecommons.org/licenses/by-nc/4.0/"
          when "pt"
            url = "http://creativecommons.org/licenses/by-nc/4.0/deed.pt"
          end
        
      when 4
          case language
          when "gl"
            url = "http://creativecommons.org/licenses/by-nc-sa/4.0/deed.gl"
          when "es"
            url = "http://creativecommons.org/licenses/by-nc-sa/4.0/deed.es_ES"
          when "en"
            url = "http://creativecommons.org/licenses/by-nc-sa/4.0/"
          when "pt"
            url = "http://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt"
          end
        
      when 5
          case language
          when "gl"
            url = "http://creativecommons.org/licenses/by-nd/4.0/deed.gl"
          when "es"
            url = "http://creativecommons.org/licenses/by-nd/4.0/deed.es_ES"
          when "en"
            url = "http://creativecommons.org/licenses/by-nd/4.0/"
          when "pt"
            url = "http://creativecommons.org/licenses/by-nd/4.0/deed.pt"
          end
        
      when 6
          case language
          when "gl"
            url = "http://creativecommons.org/licenses/by-nc-nd/4.0/deed.gl"
          when "es"
             url = "http://creativecommons.org/licenses/by-nc-nd/4.0/deed.es_ES"
          when "en"
            url = "http://creativecommons.org/licenses/by-nc-nd/4.0/"
          when "pt"
            url = "http://creativecommons.org/licenses/by-nc-nd/4.0/deed.pt"
          end
       
      when 7
          case language
          when "gl"
            url = "https://creativecommons.org/publicdomain/zero/1.0/deed.gl"
          when "es"
              url = "https://creativecommons.org/publicdomain/zero/1.0/deed.es_ES"
          when "en"
            url = "https://creativecommons.org/publicdomain/zero/1.0/deed.en"
          when "pt"
            url = "https://creativecommons.org/publicdomain/zero/1.0/deed.pt"
          end
       
    end
    return url
  end
end