#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os, sys, json
from contextlib import nested
import codecs, pystache
from clean_data import Cleaner

#ENB_DATA = "enb_section_jsons"
ENB_DATA = "enb_section_jsons-topiked"
if len(sys.argv) > 1:
    ENB_DATA = sys.argv[1]
ENB_PAGES_DIR = "enb_pages"
if len(sys.argv) > 2:
    ENB_PAGES_DIR = sys.argv[2]
CLEANING="metadata_overview/cleaning_sections_metadata.json"
if len(sys.argv) > 3:
    CLEANING = sys.argv[3]
try:
    cleaner = Cleaner(CLEANING)
except:
    cleaner = None

def build_dates(sec):
    res = sec['enb_start_date']
    if sec['enb_start_date'] != sec['enb_end_date']:
        res += u' → %s' % sec['enb_end_date']
    return res

def build_legend(sec):
    res = ""
    if sec['type']:
        res = sec['type']
        if sec['subtype']:
            res += u' — '
    if sec['subtype']:
        res += sec['subtype']
    return res

reports = {}
for path, _, files in os.walk(ENB_DATA):
    for f in files:
        if not f.endswith("json"):
            continue
        reportId, sectionId = f.replace('.json', '').decode('utf-8').split('_')
        with open(os.path.join(path, f)) as jsonf:
            section = json.load(jsonf)
            if cleaner:
                cleaner.clean_section(section)
        if reportId not in reports:
            reports[reportId] = {
                u"title": u"Earth Negotiations Bulletin: %s" % section['enb_short_title'],
                u"subtitle": section['enb_long_title'],
                u"dates": build_dates(section),
                u"source": section['enb_url'],
                u"sections": []
            }
        reports[reportId]['sections'].append({
            u"id": int(sectionId),
            u"title": section['section_title'],
            u"legend": build_legend(section),
            u"sentences": section['sentences']
        })

if not os.path.exists(ENB_PAGES_DIR):
    os.makedirs(ENB_PAGES_DIR)

for report, metas in reports.iteritems():
    metas[u'sections'].sort(key=lambda x: x[u'id'])
    with nested(open('enb_page.template.html'), codecs.open(os.path.join(ENB_PAGES_DIR, "%s.html" % report), "w", encoding="utf-8")) as (template, generated):
        generated.write(pystache.Renderer(string_encoding='utf-8').render(template.read(), metas))

