import zerorpc
from anonBrowser import *
from bs4 import BeautifulSoup
import os
import re
import logging

logging.basicConfig()

def fetchLinks(url):
		linkList = []
		ab = anonBrowser()
		ab.anonymize()
		page = ab.open(url)
		html = page.read()
		try:
			soup = BeautifulSoup(html)
			links = soup.findAll(name='a')
			for link in links:
				if link.has_attr('href'):
					print link['href']
					linkList.append(link['href'])
			return linkList
		except:
			return linkList

class RPC(object):
	def parseUrl(self, targetURL):
		print 'Received url : %s' % targetURL
		if targetURL == None:
			return 'No valid URL received'
		else:
			return fetchLinks(targetURL)


s = zerorpc.Server(RPC())
s.bind("tcp://0.0.0.0:4242")
print 'RPC python server started'
s.run()
