import csv 
import json

with open("query_result.csv", 'r') as file:
	reader = csv.reader(file)

	next(reader)

	features = {}

	features["after_features"] = []

	i = 0
	for row in reader:

		name = row[2]
		latitude = row[6]
		longitude = row[7]
		
		new_feature = { "type": "Feature", "id": i, "properties": { "SITE_NAME": name, "ADDRESS": "", \
		"PHONE": "", "SHELTER": "YES", "SHEL_FOOD": "YES", "SHEL_CAP": 0, "EditDate": "" }, \
		"geometry": { "type": "Point", "coordinates": [ float(longitude), float(latitude) ] } }

		i+=1

		features["after_features"].append(new_feature)

	print(json.dumps(features))
