# Climate Negotiations Browser

A web app exploration of ENB data.

## Install

Using recent Node.js: 

```bash
cd app
npm install
npm run build

```

Then serve statically the build directory (with Apache to use the .htaccess enabling fast zipped service of the data).

## Data

The data was extracted from the [ENB volume 12](http://www.iisd.ca/vol12/) website, formatted and tagged by EPFL, then cleaned, refined and tagged again by médialab.
Please consult `datapackage.json` for more details.

## Architecture
- app
  The code for the datascrape web front
  - discover: standalone html5 app for the discover part of the interface
  - explorer: standalone React app for the explorer part of the interface
  - data: where both apps read the source data
- ENB-data
  The source data folder where cleaning and generation happen.
  - enb_section_jsons: the json data generated by EPFL
  - enb_section_jsons-topiked: the json data retagged from `topics-keywords.csv` via `tag_enb_topics.py`
  - metadata_overview: the built generated metadata overview files for use in the apps generated from the json by `metadata_csv_generator.py`
  - metadata_csv_generator.py : a python script to generate metadata overview
  - enb_pages: fake ENB bulletins regenerated from the data for exploration in the explorer app via `build_enb_copy_pages.py` using `enb_page.template.html`, `bulletin.css` and `bulletin.js`
- front_viz_prototype
  d3.js tryouts for the discover visualisations

## Licenses

All the source code is released under the [MIT License](https://opensource.org/licenses/MIT). 
All the data is republished under the [ODC-BY License](http://opendatacommons.org/licenses/by/) meaning you have to cite the source whenever reusing it.

## Notes regarding GDPR compliance

The analytics are not configured on this website and thus are not enabled in production, which is what we want.
