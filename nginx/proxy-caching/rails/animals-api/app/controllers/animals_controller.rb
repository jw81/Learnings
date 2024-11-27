class AnimalsController < ApplicationController
  def show
    animal = Animal.find(params[:id])
    response.headers['Cache-Control'] = 'public, max-age=3600'
    render json: animal
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Animal not found" }, status: :not_found
  end
end
