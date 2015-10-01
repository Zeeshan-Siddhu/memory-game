class WebHitsController < ApplicationController
  
  def options
    byebug
    if access_allowed?
      set_access_control_headers
      head :ok
    else
      head :forbidden
    end
  end

  protected
  
  def set_access_control_headers
    headers['Access-Control-Allow-Origin'] = request.env['HTTP_ORIGIN']
    headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS, PATCH'
    headers['Access-Control-Max-Age'] = '1000'
    headers['Access-Control-Allow-Headers'] = '*,x-requested-with,Content-Type, X-CSRF-Token'
    headers['Access-Control-Allow-Credentials'] = "true"
  end


  def access_allowed?
    request.format.json?  
  end  
end