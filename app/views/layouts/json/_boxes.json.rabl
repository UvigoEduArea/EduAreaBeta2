attribute :id, :title, :description
attribute :page_position => :position
attribute :box_type => :type
attribute :data_type

node do |this|
	{:data_boxes => partial("/layouts/json/data_boxes", :object => this.data_boxes.where(:element_id => locals[:element_id]))}
end