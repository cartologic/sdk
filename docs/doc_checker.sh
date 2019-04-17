#!/bin/bash

#
# Finds missing documentation.
#

find ../src/ -name "*.jsx" -exec ./doc_checker.js {} \;
