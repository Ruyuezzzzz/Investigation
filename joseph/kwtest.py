import json
with open("keywordCards.json", "r") as f :
    l = json.load(f)['keywords']
    
for obj in l :
    s = obj['siblings']
    for sib in s :
        for obj2 in l :
            if obj2['value'] == sib :
                print('hit: %s has the following sibling' % obj['value'])
                print(json.dumps(obj2, indent=2))