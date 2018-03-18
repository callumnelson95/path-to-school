import csv



basic_csv = "../basic17.csv"
mcas = "../NextGenMCAS17.csv"
basic_only_mcas = "../basic_only_mcas.csv"
racegender17 = "../racegender17.csv"
racegender_only_mcas = "../racegender_only_mcas.csv"
selectedpop17 = "../selectedpopulations17.csv"
selectedpop_only_mcas = "../selectedpop_only_mcas.csv"
enrollment17 = "../enrollment17.csv"
enrollment_only_mcas = "../enrollment_only_mcas.csv"


with open(mcas, 'r', encoding='utf-8-sig') as file:

	csv_reader = csv.DictReader(file)

	ids = {}

	for row in csv_reader:
		mcas_id = row['id']

		if mcas_id not in ids:
			ids[mcas_id] = row['school']

	with open(enrollment17, 'r', encoding='utf-8') as basic_file:
		reader = csv.reader(basic_file)
		next(reader)

		with open(enrollment_only_mcas, 'w') as new_file:
			writer = csv.writer(new_file)
			
			#writer.writerow(['School', 'id', 'Type', 'Function', 'Contact Name', 'Address', 'Town', 'State', 'Zip', 'Phone', 'Fax', 'Grade'])
			#writer.writerow(['school','id','african_american','asian','hispanic','white','native','Native Hawaiian, Pacific Islander','Multi-Race, Non-Hispanic','male','female'])
			#writer.writerow(['school_id', 'year', 'first_lang_not_eng_num', 'first_lang_not_eng_per', \
			#				'ELL_num', 'ELL_per', 'disabilities_num', 'disabilities_per', 'low_inc_num', 'low_inc_per'])

			writer.writerow(['school_id', 'year', 'total'])

			i = 0
			for row in reader:
				
				"""sid = row[1].replace(u'\xa0', '')
				sid = sid.lstrip('0')
				print(sid)"""
				
				if row[0] in ids:
					i+=1
					
					writer.writerow(row)

			print(i)