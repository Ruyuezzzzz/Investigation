import requests
from bs4 import BeautifulSoup

page = requests.get ('http://www.theguardian.com/world/2016/mar/17/eu-leaders-set-for-tense-talks-over-refugee-deal-with-turkey')
print(page.text)

page_data = BeautifulSoup(page.text)
print(page_data)

# div = page_data.find_all('div', attrs={'class': 'content__article-body from-content-api js-article__body'})
# print(div)
#
# for text in page_data.find_all('aside', attrs={'class': 'element element-rich-link element--thumbnail element-rich-link--upgraded'}):
#     text.extract()
#
# for p in div:
#     print(p.text)

div = page_data.find_all('div', attrs={'class': 'content__article-body from-content-api js-article__body'})
print(div)
for p in div:
    print(p.text)
