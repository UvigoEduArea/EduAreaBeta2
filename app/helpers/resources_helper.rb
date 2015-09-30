module ResourcesHelper
  
  #Helper for dropdown list for derivative uses
  def get_license(derivative, condition)
    if derivative == false and condition == "0"
      return 0
    end
    if derivative == true and condition == "0"
      return 1
    end
    if derivative == true and condition == "1"
      return 2
    end
    if derivative == true and condition == "2"
      return 1
    end
  end
  
  #Helper for radiobutton for CC0 Public Domain license
  def public_domain(created, condition)
  
    if created 
      return false
    else
      if condition == "2"
        return true
      end
    end
  end
  
  def public_domain_user(condition)
      if condition == "2"
        return true
      else
        return false
      end
  end
end
