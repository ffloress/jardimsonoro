#!/bin/bash

#SETTINGS:
source="content"
destination=".."
theme="theme"
###########################

#Generate Blog
mkdir "${destination}/blog" 2>/dev/null
pelican "$source" -s pelicanconf.py -o "${destination}/blog" -t "$theme"
########################

#Copy IMGs to folder
rsync -a "$source"/img "${destination}/blog"
##########################


#Generate Linktree
mkdir "${destination}/linktree" 2>/dev/null
cp "${destination}/blog/linktree.html" "${destination}/linktree/index.html"
############################


####sitemapfix
grep -v '</urlset>' "${destination}"/blog/sitemap.xml >"${destination}"/sitemap.xml
rm "${destination}"/blog/sitemap.xml
cat "${destination}"/indexmap.xml >> "${destination}"/sitemap.xml
####################

echo "Done!"


