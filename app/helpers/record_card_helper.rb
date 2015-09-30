module RecordCardHelper
  def link_to_with_condition(condition, object, options, html_options={}, &block)
    if condition
      if (object.removed) || (object.private && !user_signed_in?) || (object.private && object.creator_id != current_user.id && user_signed_in? && object.type != "Experience")
        capture &block
      else
        link_to options, html_options, &block
      end
    else
      capture &block
    end
  end
=begin  
  def generate_path(path, record_card)
    
    case record_card.type
    when "ActivityTemplate"
      path = "show_activity_template_path("+record_card.id.to_s+")"
    when "LessonPlanTemplate"
      path = "show_lesson_plan_template_path("+record_card.id.to_s+")"
    else
      path = path + "("+record_card.id.to_s+")"
    end
    
    return eval(path)
  end
=end
end