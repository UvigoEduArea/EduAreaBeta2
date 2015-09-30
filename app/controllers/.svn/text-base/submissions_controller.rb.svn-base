# -*- coding: utf-8 -*-
class SubmissionsController < ElementsController
  
  def update
    submission = params[:controller].singularize.camelize.constantize.find(params[:id])
    case params[:campo]
    when "title"
      submission.title = params[:contenido]
    when "description"
      submission.description = params[:contenido]
    when 'image'
      submission.image = params[:contenido]
    when 'imagenone'
      submission.image = nil
    end
    submission.save

    ReloadElementFields.reload_updated_at(submission)
       
    respond_with do |format|
       format.json { render :json => {:url => submission.image.url} }
    end
  end
  
  
  api :GET, "/submissions/:id", "Whole view"
  param_group :view, ElementsController
  example '[
    {
        "id": 1236,
        "title": "App nueva!",
        "private": true,
        "abstract": true,
        "image": "none",
        "description": "",
        "URL": ""
    }
]'
  description '===Description
  This method returns the whole view of the element'
  formats ['json']
  def whole
    
  end
  
end