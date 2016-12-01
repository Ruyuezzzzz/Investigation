from lxml import html
import requests


page = requests.get('http://www.theguardian.com/world/2016/mar/17/eu-leaders-set-for-tense-talks-over-refugee-deal-with-turkey')
tree = html.fromstring(page.content)
paragraphs = tree.xpath('//div[@class="content__article-body from-content-api js-article__body"]/ptext()')
print('\n'.join(paragraphs))
