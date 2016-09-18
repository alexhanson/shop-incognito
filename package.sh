#!/bin/bash
pushd $(dirname "${0}") > /dev/null
find . -depth 1 \
	-not -name '.*' \
	-not -name 'package.sh' \
	-not -name 'shop-incognito.zip' \
	-print | zip -r shop-incognito.zip -@
