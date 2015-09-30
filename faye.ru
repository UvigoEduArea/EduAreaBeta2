require 'faye'
 
bayeux = Faye::RackAdapter.new(:mount => '/faye', :timeout => 25, :engine => {:port => 9292})
Faye::WebSocket.load_adapter('thin')
run bayeux