# == Schema Information
#
# Table name: users
#
#  id             :integer          not null, primary key
#  loginname      :string(255)
#  firstname      :string(255)
#  lastname       :string(255)
#  street         :string(255)
#  zip            :string(255)
#  city           :string(255)
#  email          :string(255)
#  phone          :string(255)
#  birthday       :date
#  misc           :text
#  remember_token :string(255)
#  created_at     :datetime
#  updated_at     :datetime
#

require 'net/ldap'
class User < ActiveRecord::Base
	before_save :create_remember_token

	has_many :minutes


	scope :fsr

	def self.authenticate(loginname,password)
		ldap = Net::LDAP.new(:host => 'ford.fachschaft.cs.uni-kl.de')
		ldap.auth("cn=#{loginname},ou=users,dc=fachschaft,dc=informatik,dc=uni-kl,dc=de",password)
		if ldap.bind
			# create a new user if it doesn't exist yet
			user = User.find_or_create_by_loginname(loginname)
			return user
		else 
			return nil
		end
	end

	def displayed_name
		"#{firstname} #{lastname}"
	end

	private 
		def create_remember_token
			self.remember_token = SecureRandom.urlsafe_base64
		end

end
