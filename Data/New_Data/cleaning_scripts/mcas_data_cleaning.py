import csv
import numpy


mcas_raw_data = "../NextGenMCAS17.csv"
mcas_cleaned = "../mcas_cleaned.csv" 


def scale(x):
	A = 462.4
	B = 522.4

	y = 1 + ((x - A)*(10 - 1))/(B - A)

	return y


with open(mcas_raw_data, 'r', encoding='utf-8') as file:
	csv_reader = csv.DictReader(file)

	headers = csv_reader.fieldnames
	print(headers)

	ela_dict = {}
	math_dict = {}

	for row in csv_reader:
		sid = row['id']

		if row['Subject'] == "ELA":
			if sid not in ela_dict:
				ela_dict[sid] = row['average']

		else: 
			if sid not in math_dict:
				math_dict[sid] = row['average']


	with open(mcas_cleaned, 'w') as new_file:
		csv_writer = csv.writer(new_file)

		csv_writer.writerow(['school_id', 'year', 'success', 'ela_success', 'math_success'])

		i = 0

		for key in math_dict:

			sid = key 
			year = 2017

			math_success = scale(float(math_dict[key]))

			try:
				ela_success = scale(float(ela_dict[key]))
				success = float(numpy.mean([ela_success, math_success]))
			except KeyError:
				ela_success = None
				success = math_success


			new_row = [sid, year, success, ela_success, math_success]

			csv_writer.writerow(new_row)

			i+=1

		print(i)



		
