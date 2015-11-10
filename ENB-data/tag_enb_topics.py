#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os, sys, re
import csv, json

def build_index(data):
    topics = {}
    for row in data:
        if row['topic'] not in topics:
            topics[row['topic']] = {
                "title_keywords": ",".split(row['title keywords'].lower()),
                "keywords": []
            }
        topics[row['topic']]['keywords'].append(row['keywords'].lower())
    return topics

def must_tag(lowtitle, sentences, keywords):
    for k in keywords['title_keywords']:
        if re.search(r'(^|\W)%s(\W|$)' % k, lowtitle):
            return True
    alreadyFound = False
    for k in keywords['keywords']:
        if re.search(r'(^|\W)%s(\W|$)' % k, sentences):
            if alreadyFound:
                return True
            else:
                alreadyFound = True

def tag_json(data, topics):
    lowtitle = data['section_title'].lower()
    sentences = "\n".join(data['sentences']).lower() + "\n" + lowtitle
    for topic, keywords in topics.iteritems():
        if must_tag(lowtitle, sentences, keywords):
            data['topics'].append(topic)
    return data

if __name__ =="__main__":
    topics_csv = "topics-keywords.csv"
    json_dir = "enb_section_docs_9272"
    output_json_dir = "enb_section_docs_9272-topiked"
    if not os.path.exists(output_json_dir):
        os.makedirs(output_json_dir)

    with open(topics_csv) as f:
        topics = build_index(csv.DictReader(f))

    for path, _, files in os.walk(json_dir):
        for f in files:
            if f.endswith("json"):
                with open(os.path.join(path, f), "r") as jsonfile:
                    data = tag_json(json.load(jsonfile), topics)
                with open(os.path.join(output_json_dir, f), "w") as jsonfile:
                    json.dump(data, jsonfile, indent=2)

