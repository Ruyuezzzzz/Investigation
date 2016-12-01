# consolidated keyword scraping from
# the guardian, daily mail, buzzeed news, the telegraph

from lxml import html
import requests

yay_keywords = []
unique_keywords = []
barred_keywords = ['standard', 'money top stories', 'ask a money expert', 'show reports', 'sponsored', 'other',  'fashion events0', 'fashion people1']

def keywordSorting(articleKeywords):
    for item in articleKeywords:
        keywords = item.split(',')
        for keyword in keywords:
            keyword = keyword.lstrip().replace('&', 'and').replace('-', ' ').lower()
            #if keyword not in barred_keywords and 'editors choice' not in keyword and keyword != '':
            if keyword == '000':
                yay_keywords[len(yay_keywords) - 1].join([',', keyword])
            else:
                yay_keywords.append(keyword)
            if keyword not in unique_keywords:
                unique_keywords.append(keyword)

def guardianScraping():
    page = requests.get('http://www.theguardian.com/uk/')
    tree = html.fromstring(page.content)
    headlines = tree.xpath('//a[@class="u-faux-block-link__overlay js-headline-text"]/text()')
    headlineLinks = tree.xpath('//a[@class="u-faux-block-link__overlay js-headline-text"]/@href')

    for link in headlineLinks:
        article = requests.get(link + '/')
        articleTree = html.fromstring(article.content)
        articleKeywords = articleTree.xpath('//meta[@name="keywords"]/@content')
        keywordSorting(articleKeywords)

        #for item in articleKeywords:
        #    keywords = item.split(',')
        #    for keyword in keywords:
        #        keyword = keyword.lstrip().replace('&', 'and').replace('-', ' ').lower()
        #        yay_keywords.append(keyword)
        #        if keyword not in unique_keywords:
        #            unique_keywords.append(keyword)


def telegraphScraping():
    page = requests.get('http://www.telegraph.co.uk/')
    tree = html.fromstring(page.content)
    headlines = tree.xpath('//h3/a/text()')
    headlineLinks = tree.xpath('//h3/a/@href')

    #print('\n'.join(headlineLinks))

    for link in headlineLinks:
        if (link.find('/') == 0):
            page = requests.get('http://www.telegraph.co.uk' + link + '/')
        else:
            page = requests.get(link + '/')
        articleTree = html.fromstring(page.content)
        articleKeywords = articleTree.xpath('//meta[@name="keywords"]/@content')
        keywordSorting(articleKeywords)

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
        article = requests.get(link)
        articleTree = html.fromstring(article.content)
        articleKeywords = articleTree.xpath('//meta[@name="news_keywords"]/@content')
        keywordSorting(articleKeywords)

def dailyMailScraping():
    page = requests.get('http://www.dailymail.co.uk/home/index.html')
    tree = html.fromstring(page.content)
    headlines = tree.xpath('//h2[@class="linkro-darkred"]/a/text()')
    headlineLinks = tree.xpath('//h2[@class="linkro-darkred"]/a/@href')

    for link in headlineLinks:
        page = requests.get('http://www.dailymail.co.uk' + link + '/')
        articleTree = html.fromstring(page.content)
        articleKeywords = articleTree.xpath('//meta[@name="keywords"]/@content')
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


telegraphScraping()
guardianScraping()
buzzfeedNewsScraping()
dailyMailScraping()
weightedKeywords(yay_keywords)
import webbrowser
webbrowser.open('http://localhost:8000/joseph/index.html', new=2)
