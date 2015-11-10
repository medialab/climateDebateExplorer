# coding=utf8
import csv
import re
import itertools
import os
import json

volume_number=re.compile(r"Volume (\d{2}) Number (\d{1,3})")
year_city_country=re.compile(r".*(\d{4})[ \t]*?(?:[ \wéñú()\t/]*, )*([ \wéñńú/]*),[ \t]*?([ \wé]*)$")

OUT_DATA = "metadata_overview"

with open(os.path.join(OUT_DATA,"bulletins_metadata.csv"),"r") as f:
	bulletins_metadata=[]
	csvr=csv.reader(f)
	csvr.next()
	for type,infos,url,long_title,index_title in csvr:
		
		rr=re.match(volume_number,infos)
		if rr:
			volume=rr.group(1)
			number=rr.group(2)
		rr=re.match(year_city_country,infos)
		if rr:
			year=rr.group(1)
			city=rr.group(2).strip()
			country=rr.group(3).strip()
			#print "%s | %s | %s"%(year,city,country)
			if city=="on the FCCC        December":
				city="New York"
				country="USA"
		else:
			print infos
		long_title=long_title.replace("\n","").replace("\t","").strip()
		long_title=re.sub(r"\s+"," ",long_title)
		bulletins_metadata.append([index_title,long_title,city,country,year,volume,number,url])

event_url=[]
with open(os.path.join(OUT_DATA,"events_metadata.csv"),"w") as f, open(os.path.join(OUT_DATA,"events_metadata.json"),"w") as fjson:
	csvw=csv.writer(f)
	headers=["event_id","long_title","city","country","year","min_volnumber","max_volnumber"]
	csvw.writerow(["event_id","long_title","city","country","year","min_volnumber","max_volnumber"])
	json_export={}

	for event_id,events in itertools.groupby(bulletins_metadata,key=lambda e: e[0]):
		events=list(events)
		event_id="%03d"%int(event_id)

		#export csv
		csvw.writerow([event_id]+events[0][1:5]+ [min([int(e[6]) for e in events]),max([int(e[6]) for e in events])])
		
		#export json
		json_export[event_id]=dict(zip(headers[1:5],events[0][1:5]))


		#preparing the event_id/url index
		for e in events:
			event_url.append([event_id,e[-1]])
	json.dump(json_export,fjson,indent=2)

with open(os.path.join(OUT_DATA,"event_bulletinurl.csv"),"w") as f:
	csvw=csv.writer(f)
	csvw.writerow(["event_id","url"])
	for t in event_url:
		csvw.writerow(t)
