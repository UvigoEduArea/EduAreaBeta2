collection @elements
attributes :id, :title, :private, :abstract, :image, :description, :description_student, :parent_id, :type
attribute :URL, :if => lambda{|this| this.type == "Application" || this.type == "Device" || this.type == "Event" || this.type == "Content" || this.type == "Collaborator"}

node(:lesson_plan, :if => lambda{|this| this.type == "Experience"}) do |this|
	this.lesson_plan.id
end

node(:template, :if => lambda{|this| this.type == "Experience"}) do |this|
	{:id => this.lesson_plan.template.id,
	:boxes => partial("/layouts/json/boxes", :object => this.lesson_plan.template.boxes, :locals => {:element_id => this.lesson_plan.id})}
end

node(:template, :if => lambda{|this| this.type != "Experience" && this.type != "Application" && this.type != "Device" && this.type != "Event" && this.type != "Content" && this.type != "Collaborator" && this.type != "Submission"}) do |this|
	{:id => this.template.id,
	:boxes => partial("/layouts/json/boxes", :object => this.template.boxes, :locals => {:element_id => this.id})}
end

node(:resources, :if => lambda{|this| this.type == "Experience" || this.type == "LessonPlan" || this.type == "Activity"}) do |this|
	if(this.type == "Experience")
		partial("/layouts/json/full_element", :object =>this.lesson_plan.applications.where(:removed => false).order("created_at DESC")+this.lesson_plan.devices.where(:removed => false).order("created_at DESC")+
		this.lesson_plan.contents.where(:removed => false).order("created_at DESC")+this.lesson_plan.events.where(:removed => false).order("created_at DESC")+
		this.lesson_plan.collaborators.where(:removed => false).order("created_at DESC"))
	else
		partial("/layouts/json/full_element", :object => this.applications.where(:removed => false).order("created_at DESC")+this.devices.where(:removed => false).order("created_at DESC")+
		this.contents.where(:removed => false).order("created_at DESC")+this.events.where(:removed => false).order("created_at DESC")+
		this.collaborators.where(:removed => false).order("created_at DESC"))
	end
end

node(:activities, :if => lambda{|this| this.type == "Experience" || this.type == "LessonPlan"}) do |this|
	if(this.type == "Experience")
		partial("/layouts/json/full_element", :object => this.lesson_plan.activities.where(:removed => false))
	else
		partial("/layouts/json/full_element", :object => this.activities.where(:removed => false))	
	end
end

node(:submissions, :if => lambda{|this| this.type == "Experience" || this.type == "LessonPlan" || this.type == "Activity"}) do |this|
	if(this.type == "Experience")
		partial("/layouts/json/full_element", :object =>this.lesson_plan.submissions.where(:removed => false).order("created_at DESC"))
	else
		partial("/layouts/json/full_element", :object => this.submissions.where(:removed => false).order("created_at DESC"))	
	end
end

node(:resources_appends, :if => lambda{|this| this.type == "Content"}) do |this|
	partial("/layouts/json/resources_appends", :object => this.resources_appends)
end

node(:element_records, :if => lambda{|this| this.type == "Experience"}) do |this|
	partial("/layouts/json/show_record", :object => this.lesson_plan.element_records.where(:removed => false))
end

