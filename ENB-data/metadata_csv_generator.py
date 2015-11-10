import json
import os, sys
import itertools
import time
import codecs

# the valid uptodate event_bulletinurl.csv in OUT_DATA folder
LINK_TO_EVENT="event_bulletinurl.csv"
CLEANING="cleaning_sections_metadata.json"

#ENB_DATA = "enb_section_jsons"
ENB_DATA = "enb_section_jsons-topiked"
OUT_DATA = "metadata_overview"
if len(sys.argv) > 1:
    ENB_DATA = sys.argv[1]
if len(sys.argv) > 2:
    OUT_DATA = sys.argv[2]
if len(sys.argv) > 3:
    LINK_TO_EVENT = sys.argv[3]
if len(sys.argv) > 4:
    CLEANING = sys.argv[4]

format_txt = lambda x: ('"' + x.replace('"', '""').replace("\n", " ").replace("\r", "") + '"').encode('utf-8')
format_spe = lambda x: format_txt("|".join(x))
format_field = lambda x: format_txt(x) if type(x) == unicode else format_spe(x)


data_index={}

# prepare index for LINK SECTIONS TO EVENT task
add_eventid=False
if os.path.exists(os.path.join(OUT_DATA,LINK_TO_EVENT)):
    with codecs.open(os.path.join(OUT_DATA,LINK_TO_EVENT),'r',"utf8") as f:
        url_eventid=dict(reversed(id_url.replace("\r\n","").split(",")) for id_url in f.readlines()[1:])
        add_eventid=True
        url_eventid["http://www.iisd.ca/vol12/enb12300e.html"]=url_eventid["http://www.iisd.ca/vol12/enb12300.html"]
        url_eventid["http://www.iisd.ca/vol12/enb12603e.html"]=url_eventid["http://www.iisd.ca/vol12/enb125603e.html"]

# prepare index for CLEANING SECTIONS
clean_sections=False
if os.path.exists(os.path.join(OUT_DATA,CLEANING)):
    with codecs.open(os.path.join(OUT_DATA,CLEANING),'r',"utf8") as f:
        clean_infos=json.load(f)

        def keep_section(section):
            for metadata,rules in clean_infos.iteritems():
                if "exclude" in rules and section[metadata] in rules["exclude"]:
                    return False
            return True
        
        def clean_section(section):
            for metadata,rules in clean_infos.iteritems():
                if "merge" in rules :
                    if type(section[metadata])==list:
                        section[metadata]=[rules["merge"][m] if m in rules["merge"] else m for m in section[metadata]]
                    elif section[metadata] in rules["merge"]:       
                        section[metadata]=rules["merge"][section[metadata]]
            return section
        
        clean_sections=True



with open(os.path.join(OUT_DATA,"sections_metadata.csv"),"w") as f:
    headers=[
    "id",
    "title",
    "actors",
    "countries",
    "topics",
    "url",
    "event_id",
    "track",
    "format",
    "date",
    "year"
      ]
    print >> f, (",".join(headers)).encode('utf-8')
section_metadata=[]

for directory,subdir,filenames in os.walk(ENB_DATA):
    for f in filenames:
        if f.split(".")[-1]=="json":
            with open(os.path.join(directory,f),"r") as jsonfile:
                #load a section
                data=json.load(jsonfile)

                # filtering
                if not clean_sections or keep_section(data):
                    
                    # clean
                    if clean_sections:
                        data=clean_section(data)

                    # process date
                    import locale
                    locale.setlocale(locale.LC_TIME, "en_US.utf8")
                    date=time.strptime(data["enb_end_date"],"%d-%b-%y")
                    epoch_millisecond=time.mktime(date)*1000
                    year=time.strftime("%Y",date)

                    csv_data=[
                        data["id"],
                        data["section_title"],
                        [act.replace('&', 'and') for act in data["actors"]],
                        [cou.replace('&', 'and') for cou in data["countries"]],
                        [top.replace('&', 'and') for top in data["topics"]],
                        data["enb_url"],
                        u"" if not add_eventid else url_eventid[data["enb_url"]],
                        data["type"].replace('&', 'and'),
                        data["subtype"].replace('&', 'and'),
                        unicode(epoch_millisecond),
                        unicode(year)
                        ]
                    section_metadata.append(csv_data)

                    # create index and filter sentences out
                    for k,v in data.iteritems():
                        if k!="sentences":
                            data_index[k]=[v] if k not in data_index else data_index[k]+[v]



with open(os.path.join(OUT_DATA,"sections_metadata.csv"),"a") as metadata_file:
    for l in section_metadata:
        for field in l:
            try:
                format_field(field)
            except:
                print "failed to format this value :%s"%field
                exit()
        print >>metadata_file, ",".join(format_field(field) for field in l)


key_usage={}
val_usage={}

for k in data_index:
    key_usage[k]=len(data_index[k])
    if k in ["actors","countries","topics"]:
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
