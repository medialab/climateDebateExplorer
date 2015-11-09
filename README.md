# climateDebateExplorer
An web app exploration of ENB data.
# repo structure
- ENB-data
  The data folder 
  - ENB-data/enb_section_docs_9272_from_645 : the json data from EPFL
  - metadata_csv_generator.py : a python script to generate metadata overview
  - metadata_overview : the metadata overview files

# data model
## paragraph/section database
- id: id_paragraph(.json)
- title:str (old section_title)
- actors : list
- countries: list
- topics: list
- url:str
- event_id: pointeur vers event database
- track:str (old type)
- format:str (old subtype)
- date:end_date (à formater)

The good order of the paragraphe is (event_id)_(id)

##  event database
- event_id: scrap_id with heading 000
- long title:
- short title:
- city
- country
- year
- start_date
- end_date
