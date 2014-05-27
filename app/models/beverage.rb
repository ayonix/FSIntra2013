# == Schema Information
#
# Table name: beverages
#
#  id             :integer          not null, primary key
#  name           :string(255)
#  description    :text
#  available      :boolean
#  price          :decimal(8, 2)
#  created_at     :datetime
#  updated_at     :datetime
#  capacity       :decimal(8, 2)
#  external_price :decimal(8, 2)
#

class Beverage < ActiveRecord::Base
	include ActionView::Helpers::NumberHelper
	validates :name, :presence => true, uniqueness: {scope: :price}
	validates :price, :numericality => {:greater_than => 0}
	validates :external_price, :numericality => {:greater_than => 0}
	validates :capacity, :numericality => {:greater_than => 0}

	scope :available, -> { where :available => true }

	def to_s
		"#{self.name} (#{number_to_currency self.price} / #{number_to_human self.capacity, :separator => ',', :significant => false, :precision => 2, :units => {:unit => 'l'}})"
	end
end
