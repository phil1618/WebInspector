import zerorpc, os, re, logging, gevent, json
from anonBrowser import *
from bs4 import BeautifulSoup

logging.basicConfig()

#---------------------------------------------------
#	HTML content fetchers
#---------------------------------------------------	
#	HTML fetcher
def fetchHTML(url):
		print '[-] HTML fetching started'
		ab = anonBrowser()
		ab.anonymize()
		page = ab.open(url)
		html = page.read()                                                                                
		print '[-] HTML fetching done'
		allLinks   = fetchLinks(html)
		print '[-] HREF parsed'
		allScripts = fetchScripts(html)
		print '[-] SCRIPT ref parsed'
		allMetas   = fetchMetadata(html)
		print '[-] METADATA parsed'

		answer = {}
		answer['message'] = 'OK'
		answer['links'] = allLinks 
		answer['scripts'] = allScripts
		answer['meta'] = allMetas
		print '[+] Returning the results'
		return answer
#	HREFs fetcher
def fetchLinks(html):
		linkList = []
		try:
			soup = BeautifulSoup(html)
			links = soup.findAll(name='a')
			for link in links:
				if link.has_attr('href'):
					linkList.append(link['href'])
			return linkList
		except:
			return linkList
#	Scripts fetcher
def fetchScripts(html):
		scriptList = []
		try:
			soup = BeautifulSoup(html)
			scripts = soup.findAll(name='script')
			for script in scripts:
				if script.has_attr('src'):
					scriptList.append(script['src'])
			return scriptList
		except:
			return scriptList
#	Metadata fetcher
def fetchMetadata(html):
		metaData = {}
		try:
			soup = BeautifulSoup(html)
			metas = soup.findAll(name='meta')
			for meta in metas:
				if meta.has_attr('name'):
					metaData[meta['name']] = meta['content']
			return json.dumps(metaData)
		except:
			return json.dumps(metaData)
#---------------------------------------------------
#	The server itself
#---------------------------------------------------	
class RPC(zerorpc.Server):
	def parseHtml(self, targetURL, async=True):
		print '[+] Received url to parse : %s' % targetURL
		answer = {}
		if targetURL == None:
			answer['message'] = 'Received URL is not valid'
			return answer
		else:
			return fetchHTML(targetURL)

	def parseUrl(self, targetURL, async=True):
		print '[+] HREF parser received url : %s' % targetURL
		if targetURL == None:
			return 'No valid URL received'
		else:
			return fetchLinks(targetURL)
	def parseScript(self, targetURL, async=True):
		print '[+] SCRIPT parser received url : %s' % targetURL
		if targetURL == None:
			return 'No valid URL received'
		else:
			return fetchScripts(targetURL)
	def parseMeta(self, targetURL, async=True):
		print '[+] METADATA parser received url : %s' % targetURL
		if targetURL == None:
			return 'No valid URL received'
		else:
			return fetchMetadata(targetURL)
HREFsrv = RPC()
HREFsrv.bind("tcp://0.0.0.0:4242")
print 'RPC python server started'
gevent.spawn(HREFsrv.run())
