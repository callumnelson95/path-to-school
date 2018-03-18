import csv
import numpy as np
import operator

neighbors_info = "../neighbors_info.csv"
neighbors = "../neighbors.csv"

with open(neighbors_info, 'r') as file:
	csv_reader = csv.DictReader(file)

	headers = csv_reader.fieldnames
	print(headers)

	chars_dict = {}
	differences_dict = {}
	neighbors_dict = {}

	for row in csv_reader:
		sid = row['school_id']

		chars = [row['african_american'], row['asian'], row['hispanic'], row['white'], row['native'],\
				row['male'], row['female'], row['first_lang_not_eng_per'], row['ELL_per'], \
				row['disabilities_per'], row['low_inc_per']]

		chars = [float(x) for x in chars]

		chars_dict[sid] = chars


	for key in chars_dict:

		key_chars = chars_dict[key]
		differences = []

		for other_key in chars_dict:

			if other_key != key:

				other_chars = chars_dict[other_key]
				difference_list = np.array(key_chars) - np.array(other_chars)
				difference = sum([abs(dif) for dif in difference_list])

				differences.append((other_key, difference))


		differences.sort(key=operator.itemgetter(1))


		neighbors_dict[key] = differences[:10]

	with open(neighbors, 'w') as new_file:
		
		writer = csv.writer(new_file)

		writer.writerow(['school_id','year','n1', 'n2','n3','n4','n5','n6','n7','n8','n9','n10'])

		for key in neighbors_dict:

			new_row = [key, 2017] + [pair[0] for pair in neighbors_dict[key]]
			
			writer.writerow(new_row)




