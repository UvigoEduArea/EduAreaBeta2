module KeywordsClass
  class KeywordsObject
    
    def initialize(element)
      @@input = Array.new
      @@output = Array.new
      @@element = element  
    end
    
    def getInput
      return @@input
    end
    
    def getOutput
      return @@output
    end
    
    def getElement
      return @@element
    end
    
    def setInputArray(array)
      @@input = array
    end
    
    def setInputObject(object)
      @@input.push(object)
      p @@input
    end
    
    def setOutput(object)
      @@output.push(object)
    end
    
    def insertKeywordsIntoDatabase(object)
      if object.getInput.length != 0
        keyword = Keyword.new
        keyword.keyword = object.getInput.first["term"]
        if object.getElement.keywords.where(:keyword => keyword.keyword).blank?
          object.getElement.keywords << keyword
          object.setOutput(keyword)
        end
        object.setInputArray(object.getInput.drop(1))
        insertKeywordsIntoDatabase(object)
      end
      
      return
    end
    
  end
end