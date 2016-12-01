from lxml import html
from bs4 import BeautifulSoup
import re
import requests
import time
import json

#hello Iman

deck_of_cards = []
deck_of_keywords = {}
yay_keywords = []
unique_keywords = []
barred_keywords = ['standard', 'money top stories', 'ask a money expert', 'show reports', 'sponsored', 'other',  'fashion events0', 'fashion people1']


class factCard(object):
    def __init__(self, content, source, url, date, keywords):
        self.content = content
        self.source = source
        self.url = url
        self.date = date
        self.keywords = keywords

    def to_json(self):
        return {"content": self.content, "source": self.source, "url": self.url, "date": self.date, "keywords": self.keywords}

    def __repr__(self):
        return str({"content": self.content, "source": self.source, "url": self.url, "date": self.date, "keywords": self.keywords})

class keywordCard(object):
    def __init__(self, value, date, keywords):
        self.siblings = keywords
        self.dates = [date]
        self.value = value
        self.siblings.remove(self.value)

    def __repr__(self):
        return(str({"value": self.value, "siblings": self.siblings, "date": self.dates}))

    def to_json(self):
        return({"value": self.value, "siblings": self.siblings, "date": self.dates})

    def howManySiblings(self):
        return(len(self.siblings))

    def lastSeenOn(self):
        if (len(self.dates) > 1):
            return(self.dates[-2])
        else:
            return(self.dates[-1])

    def newSighting(self, date):
        self.dates.append(date)


def weightedKeywords(keywords):
    #from collections import Counter
    #return(Counter(keywords))
    import time
    timer = open('timer.txt', 'w')
    timer.write(time.strftime("%Y-%m-%d %H:%M"))

    counts = dict()
    for i in keywords:
        if i not in barred_keywords and 'editors choice' not in i and i != '':
            counts[i] = counts.get(i, 0) + 1

    output = open('keywords_counting' + time.strftime("%Y-%m-%d %H:%M") + '.txt', 'w')
    for k, v in sorted(counts.items()):
        output.write('{}: {} \n'.format(k,v))

    bigCounts = dict((k, v) for k, v in counts.items() if v > 1)

    import json
    with open('result.json', 'w') as fp:
        json.dump(bigCounts, fp)
    return(bigCounts)

def keywordSorting(articleKeywords):
    for keyword in articleKeywords:
        deck_of_keywords[keyword] = keywordCard(keyword, "19-Apr-2016", articleKeywords)
        keyword = keyword.lstrip().replace('&', 'and').replace('-', ' ').lower()
        #if keyword not in barred_keywords and 'editors choice' not in keyword and keyword != '':
        if keyword == '000':
            yay_keywords[len(yay_keywords) - 1].join([',', keyword])
        else:
            yay_keywords.append(keyword)
        if keyword not in unique_keywords:
            unique_keywords.append(keyword)

def guardianScraping():
    print("begin")
    page = requests.get('http://www.theguardian.com/uk/')
    tree = html.fromstring(page.content)
    headlines = tree.xpath('//a[@class="u-faux-block-link__overlay js-headline-text"]/text()')
    headlineLinks = tree.xpath('//a[@class="u-faux-block-link__overlay js-headline-text"]/@href')

    for link in headlineLinks:
        print("here we go")
        page = requests.get(link + '/')
        articleTree = html.fromstring(page.content)
        soup = BeautifulSoup(page.content, "lxml")
        article = soup.findAll("div", { "class" : "content__article-body" })
        articleKeywords = list(articleTree.xpath('//meta[@name="keywords"]/@content')[0].lower().split(','))
        keywordSorting(articleKeywords)

        for tag in article:
            print ("step 2")
            paras = tag.findAll('p')
            for p in paras:
                p = str(p)
                text = re.sub('<[^<]+?>', '', p)
                if any(char.isdigit() for char in text):
                    deck_of_cards.append(factCard(text, 'The Guardian', link, time.strftime("%d/%m/%Y, %H:%M"), articleKeywords))

        print(article)


        # # THIS BIT BELOW NEEDS TO BE DONE USING BEAUTIFUL SOUP!!
        # #paragraphs = articleTree.xpath('//div[@class="content__article-body from-content-api js-article__body"]/p/text()')
        # for p in article:
        #     p = str(p)
        #     text = re.sub('<[^<]+?>', '', p)
        #     if any(char.isdigit() for char in text):
        #         deck_of_cards.append(factCard(text, 'The Guardian', link, time.strftime("%d/%m/%Y, %H:%M"), articleKeywords))
        # #BEAUTIFUL SOUP ME PLEASE ^^^^^


def telegraphScraping():
    page = requests.get('http://www.telegraph.co.uk/')
    tree = html.fromstring(page.content)
    headlines = tree.xpath('//h3/a/text()')
    headlineLinks = tree.xpath('//h3/a/@href')

    #print('\n'.join(headlineLinks))

    for link in headlineLinks:
        print("here we go T")
        if (link.find('/') == 0):
            page = requests.get('http://www.telegraph.co.uk' + link + '/')
        else:
            page = requests.get(link + '/')
        articleTree = html.fromstring(page.content)
        soup = BeautifulSoup(page.content, "lxml")
        article = soup.findAll("article")
        try:
            articleKeywords = list(articleTree.xpath('//meta[@name="keywords"]/@content')[0].lower().replace("-", " ").split(","))
        except IndexError:
            pass
        keywordSorting(articleKeywords)

        for tag in article:
            print("step 2 T")
            paras = tag.findAll('p')
            for p in paras:
                p = str(p)
                text = re.sub('<[^<]+?>', '', p)
                if any(char.isdigit() for char in text):
                    deck_of_cards.append(factCard(text, 'The Telegraph', link, time.strftime("%d/%m/%Y, %H:%M"), articleKeywords))

        print(article)

def buzzfeedNewsScraping():
    page = requests.get('http://www.buzzfeed.com/news/')
    tree = html.fromstring(page.content)
    headlines = tree.xpath('//a[@class="lede__link"]/text()')
    headlineLinks = tree.xpath('//a[@class="lede__link"]/@href')
    miniHeadlineLinks = []

    for link in headlineLinks:
        if link not in miniHeadlineLinks:
            miniHeadlineLinks.append("http://www.buzzfeed.com/" + link)

    for link in miniHeadlineLinks:
        page = requests.get(link)
        articleTree = html.fromstring(page.content)
        soup = BeautifulSoup(page.content, "lxml")
        article = soup.findAll("div", { "class" : "buzz_superlist_item_text" })
        articleKeywords = list(articleTree.xpath('//meta[@name="news_keywords"]/@content')[0].lower().split(","))
        keywordSorting(articleKeywords)

        for tag in article:
            print("step 2 T")
            paras = tag.findAll('p')
            for p in paras:
                p = str(p)
                text = re.sub('<[^<]+?>', '', p)
                if any(char.isdigit() for char in text):
                    deck_of_cards.append(factCard(text, 'Buzzfeed News', link, time.strftime("%d/%m/%Y, %H:%M"), articleKeywords))

        print(article)

def dailyMailScraping():
    page = requests.get('http://www.dailymail.co.uk/home/index.html')
    tree = html.fromstring(page.content)
    headlines = tree.xpath('//h2[@class="linkro-darkred"]/a/text()')
    headlineLinks = tree.xpath('//h2[@class="linkro-darkred"]/a/@href')

    for link in headlineLinks:
        page = requests.get('http://www.dailymail.co.uk' + link + '/')
        articleTree = html.fromstring(page.content)
        articleKeywords = list(articleTree.xpath('//meta[@name="keywords"]/@content')[0].split(',').lower().lstrip())
        for item in articleKeywords:
            keywords = item.split(',')
            for i in range(len(keywords)):
                if i < (len(keywords) - 1):
                    keyword = keywords[i].lstrip().replace('&', 'and').replace('-', ' ').lower()
                    keyword2 = keywords[i+1].lstrip().replace('&', 'and').replace('-', ' ').lower()
                else:
                    keyword = keywords[i].lstrip().replace('&', 'and').replace('-', ' ').lower()
                    keyword2 = ''
                if keyword in yay_keywords:
                    if keyword == '000':
                        yay_keywords[len(yay_keywords) - 1].join([',', keyword])
                    else:
                        yay_keywords.append(keyword)
                    if keyword not in unique_keywords:
                        unique_keywords.append(keyword)
                if (keyword + ' ' + keyword2) in yay_keywords:
                    yay_keywords.append(keyword + ' ' + keyword2)

            soup = BeautifulSoup(page.content, "lxml")
            article = soup.findAll("div", { "id" : "js-article-text" })

            for tag in article:
                print("step 2 T")
                paras = tag.findAll('p')
                for p in paras:
                    p = str(p)
                    text = re.sub('<[^<]+?>', '', p)
                    if any(char.isdigit() for char in text):
                        deck_of_cards.append(factCard(text, 'Buzzfeed News', link, time.strftime("%d/%m/%Y, %H:%M"), articleKeywords))
            print(article)

#dailyMailScraping()
buzzfeedNewsScraping()
guardianScraping()
telegraphScraping()
weightedKeywords(yay_keywords)


with open("cards.json", 'w') as cards:
    json.dump({"cards": [c.to_json() for c in deck_of_cards]}, cards)
    

print(deck_of_keywords)
