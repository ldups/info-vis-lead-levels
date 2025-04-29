lead_zip_path = "data\\child_blood_lead_levels_by_zip.csv"

with open(lead_zip_path) as lead:
    lines = lead.readlines()
    philly_zips=[]
    for i in range(1, len(lines)):
        philly_zips.append(lines[i].split(',')[0])

housing_path = "data\\census_physical_housing.csv"
new_housing_path = "data\\philly_housing.csv"
with open(housing_path) as housing:
    housing = housing.readlines()
    with open(new_housing_path, 'w') as new_housing:
        for i in range(2, len(housing)):
            line = housing[i]
            zip = line.split(',')[1].split('ZCTA5 ')[1].strip('"')
            print(zip)
            if zip in philly_zips:
                new_housing.write(line)
