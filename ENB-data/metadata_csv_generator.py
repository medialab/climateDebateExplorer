import json
import os
import itertools


ENB_DATA = "enb_section_docs_9272_from_645"
OUT_DATA = "metadata_overview"


format_txt = lambda x: ('"' + x.replace('"', '""').replace("\n", " ").replace("\r", "") + '"').encode('utf-8')
format_spe = lambda x: format_txt("|".join(x))
format_field = lambda x: format_txt(x) if type(x) == unicode else format_spe(x)


data_index={}

with open(os.path.join(OUT_DATA,"metadata.csv"),"w") as f:
	headers=["countries", 
    "topics", 
    "section_title", 
    "enb_start_date", 
    "enb_short_title", 
    "subtype", 
    "actors", 
    "enb_url", 
    "enb_long_title", 
    "type", 
    "id", 
    "enb_end_date"]
	print >> f, (",".join(headers)).encode('utf-8') 

for directory,subdir,filenames in os.walk(ENB_DATA):
	for f in filenames:
		if f.split(".")[-1]=="json":
			with open(os.path.join(directory,f),"r") as jsonfile:
				data=json.load(jsonfile)
				for k,v in data.iteritems():
					if k!="sentences":
						data_index[k]=[v] if k not in data_index else data_index[k]+[v]
				with open(os.path.join(OUT_DATA,"metadata.csv"),"a") as f:
					print >>f, ",".join([format_field(data[a]) for a in headers])
key_usage={}
val_usage={}

for k in data_index:
	key_usage[k]=len(data_index[k])
	if k in ["actors","countries"]:
		values=[_ for v in data_index[k] for _ in v]
	else:
		values=data_index[k]
	val_usage[k]=values if k not in val_usage else val_usage[k]+values

val_stat={}
for k in val_usage:
	val_stat[k]={}
	for value,values in itertools.groupby(sorted(val_usage[k])):
		val_stat[k][value if value != [] else ""]=len([_ for _ in values])

	val_stat[k]=sorted(val_stat[k].iteritems(),key=lambda t:t[1],reverse=True)


with open(os.path.join(OUT_DATA,"key_stat.json"),"w") as f:
	json.dump(key_usage,f,indent=4)
with open(os.path.join(OUT_DATA,"val_stat.json"),"w") as f:
	json.dump(val_stat,f,indent=4)
