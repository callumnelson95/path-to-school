import csv
from geopy.geocoders import Nominatim
import numpy
import re
import math
		
# importing the requests library
import requests


basic_csv = "../basic_only_mcas.csv"
new_file = "../basic_chars_cleaned17.csv"
url = "https://maps.googleapis.com/maps/api/geocode/json?address="
key = "&key=AIzaSyBA9DgScT4pX-zIcfDTF7ifpcijZ853o6I"


with open(basic_csv, 'r', encoding='utf-8-sig') as file:
	csv_reader = csv.DictReader(file)

	headers = csv_reader.fieldnames
	print(headers)
	geolocator = Nominatim()

	with open(new_file, 'w') as new_file:
		csv_writer = csv.writer(new_file)
		csv_writer.writerow(['school_id', 'year', 'school', 'charter', 'level', 'town', 'lat', 'long'])

		i = 0
		for row in csv_reader:
			
			#set up variables for new row
			i+=1
			school_id = row['id']
			year = 2017
			school = row['School'].split(':')[1].strip()
			charter = 0
			if "Charter" in row['Type']:
				charter = 1
			
			high_grade = int(row['Grade'].split(',')[-1])
			level = "Primary"
			if high_grade > 6:
				level = "Middle"
			if high_grade > 9:
				level = "High"

			town = row['Town']

			#Strip street and town names and format
			st = re.sub("\s+", "+", row['Address'].strip())
			t = re.sub("\s+", "+", row['Town'].strip())

			address = st + ',+' + t + ',+MA,+' + '0' + row['Zip']
			# defining a params dict for the parameters to be sent to the API
			URL = url + address + key
			# sending get request and saving the response as response object
			r = requests.get(URL)

			data = r.json()

			try:
				latitude = data['results'][0]['geometry']['location']['lat']
				longitude = data['results'][0]['geometry']['location']['lng']
			except IndexError:
				latitude = 0
				longitude = 0
				print(school)
			

			csv_writer.writerow([school_id, year, school, charter, level, town, latitude, longitude])

			print(i)


