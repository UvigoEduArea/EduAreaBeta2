collection @comments
p "estoy en el json"
attribute :id
attribute :description => :text, :created_at => :published
node :user do |comment|
	{:name => comment.user.profile.first_name,
	:surname => comment.user.profile.last_name,
	:avatar => comment.user.profile.avatar
	}
end