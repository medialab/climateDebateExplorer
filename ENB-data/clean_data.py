# -*- coding: utf-8 -*-

import os
import json
import codecs

class Cleaner(object):

    def __init__(self, rules_filename=os.path.join("metadata_overview", "cleaning_sections_metadata.json")):
        self.rules_filename = rules_filename
        try:
            with codecs.open(self.rules_filename, 'r', "utf-8") as f:
                self.rules = json.load(f)
        except Exception as e:
            print >> sys.stderr, "WARNING: missing rules file in %s: %s %s" % (self.rules_filename, type(e), e)
            raise(e)

    def keep_section(self, section):
        for metadata, rules in self.rules.iteritems():
            if "exclude" in rules and section[metadata] in rules["exclude"]:
                return False
        return True

    def clean_section(self, section):
        for metadata, rules in self.rules.iteritems():
            if "merge" in rules:
                if type(section[metadata]) == list:
                    section[metadata] = [rules["merge"][m] if m in rules["merge"] else m for m in section[metadata]]
                elif section[metadata] in rules["merge"]:
                    section[metadata] = rules["merge"][section[metadata]]
        return section
