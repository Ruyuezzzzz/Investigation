from lxml import html
import requests
import time

deck_of_cards = []

class factCard(object):
    def __init__(self, content, source, url, date):
        self.content = content
        self.source = source
        self.url = url
        self.date = date

    def to_json(self):
        return {"content": self.content, "source": self.source, "url": self.url, "date": self.date}

    def __repr__(self):
        return "This content: \n {} \n was found at {} on {}".format(self.content, self.source, self.date)

webAddress = "http://www.theguardian.com/business/2016/apr/12/eu-regulators-demand-greater-tax-transparency-companies"
page = requests.get(webAddress)
tree = html.fromstring(page.content)
paragraphs = tree.xpath('//div[@class="content__article-body from-content-api js-article__body"]/p/text()')


for p in paragraphs:
    deck_of_cards.append(factCard(p, 'The Guardian', webAddress, time.strftime("%d/%m/%Y, %H:%M")))

import json
with open("cards.json", 'w') as cards:
    json.dump([c.to_json() for c in deck_of_cards], cards)
