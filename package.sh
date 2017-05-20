#!/bin/bash
pushd $(dirname "${0}") > /dev/null

OUTPUT="shop-incognito.zip"
rm "$OUTPUT"

find . \
	\( \
			-type d \
			-name '.git' \
			-prune \
		-o \
			-type f \
			-not -name '.*' \
			-not -name 'package.sh' \
			-not -name 'shop-incognito.zip' \
			-print \
	\) | zip -r "$OUTPUT" -@
