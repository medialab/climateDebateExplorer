#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os, sys
import csv
#import pystache

reports = {}
with open(sys.argv[1]) as f:
    for row in list(csv.DictReader(f)):
        reportId, sectionId = row['id'].split('_')
        if reportId not in reports:
            reports[reportId] = []
        reports[reportId].append(int(sectionId))

for report, sections in reports.iteritems():
    sections.sort()
    reportData = {
        'title': 'Earth's Negociation Bulletin',
    }

