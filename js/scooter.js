//Note to Self(Joe) - Tidy up all of this nonsense!!!


//Load in Video Page
//=============================================================================

get_video_page = function(uc1, uc2, uc3) {
  grabHtml = new XMLHttpRequest();
  grabHtml.open('GET', '../assets/videopagehtml.html', false);
  grabHtml.send();
  document.querySelector('body').innerHTML = grabHtml.responseText
  document.querySelector('body').style.background = "#000"
  changeVid(uc1, uc2, uc3);
  change_question(uc2);
  facts();

}

// Changing the questions for the video page
//=============================================================================
change_question = function(uc2) {
  questions = { "refugee crisis" : "Which European (EU) countries receive the most asylum applications? Why",
                "asylum seekers" : "In the United Kingdom, which nationalities do you think had the highest number of applications? Why",
                "application outcomes" : "What do you think is the outcome for asylum seekers applications",
                "eu voters" : "What kind of demographics do you think favours for UK to remain as an EU member and who favours otherwise",
                "eu influence" : "Does being a member of the EU boosts UK's influence and security",
                "uk spending" : "How much of the UK budget is being used to contribute to the EU",
                "top candidates" : "Who do you think is currently the top candidates in the US Election",
                "voters issues" : "What are the issues that voters are most concerned about in the UK",
                "us voters" : "What kind of demographics will vote for the following candidates: Donald Trump, Hillary Clinton, Bernie Sanders and Ted Cruz",
                "oscars" : "Do you think that Oscars are too white",
                "diversity" : "What reasons do you think contribute to the lack of diversity in Oscars",
                "films" : "Will you be more likely to see a film with more diverse actors and what is your favorite film last year",
                "super injunctions" : "Do you know about super injunctions",
                "celebrity threesome" : "Do you know who were involved in the recent celebrity threesome injunction",
                "injunctions law" : "Do you think it is still relevant for such a law to exist in the age of the Internet",
                "teamcap teamstark" : "If superheroes existed, do you want them to be registered with the government? And, which team are you on, Team Captain or Team Stark",
                "franchise gross" : "How much in total do you think the Marvel movie franchise raked in",
                "dc marvel" : "Between DC universe and Marvel universe, which universe do you think has more fans",
                "rental prices" : "Do you know the average rent or house price in your area",
                "transport costs" : "Do you know the current price of brent crude oil per barrel",
                "student loans" : "Which country's universities have the highest tuition fees",
                "haven locations" : "Do you know where are the tax havens",
                "haven users" : "Do you know how many individuals or organisations that utilises these tax havens",
                "evasion avoidance" : "Do you know the differences between tax evasion and tax avoidance"
              }

  questionText = document.getElementById('question-text')
  questionText.innerHTML = questions[uc2]
  console.log(questions[uc2])

}

// Temporary fix
//=============================================================================
/*factsAndFigures = function(uc2) {

  var fact = new XMLHttpRequest();
  fact.open("GET", "facts.json", true);
  fact.send()
  facts = JSON.parse(fact.responseText);
  console.log(facts)
};
  var sidebar = document.getElementById('sidebar-wrapper')
  for (i = 0; i < 5; i++) {
    var div = document.createElement('div')
    for (i=0: i<facts.reponse.length;i++){
    var factText = document.createTextNode(facts.response[i])
    div.setAttribute("class", "facts-and-figures")
    div.appendChild(factText)
    sidebar.appendChild(div)
}}}*/

// Facts and Figures Sidebar
//=============================================================================

var clicks = 0;

var facts = function() {
  var fact = new XMLHttpRequest();
  fact.open("GET", "assets/facts/"+user_choice2+".text", false);
  fact.send()

  var facts = JSON.parse(fact.responseText);
  console.log(facts);
  console.log(facts.facts.length);
  clicks += 1;
  console.log(clicks)
  console.log(facts.facts[clicks-1]);

  var sidebar = document.getElementById('sidebar-wrapper')

  var div = document.createElement('div')

  var text = document.createTextNode(facts.facts[clicks-1]);
  div.setAttribute("class", "bubble hvr-grow-shadow hvr-bounce-in")
  div.appendChild(text)
  sidebar.appendChild(div)

  var btn = document.createElement("button")
  btn.setAttribute("id", "btn2")
  btn.setAttribute("onclick", "facts();")

  var t = document.createTextNode("More");
  btn.appendChild(t);
  sidebar.appendChild(btn);

  var number= document.getElementsByTagName('p').length
  console.log(number)

  var content =  facts.facts.length
  console.log(content);

  if(clicks>1){ document.getElementsByTagName("button")[0].remove(); }

  if(number === 6 ){ document.getElementsByTagName("p")[0].remove(); };

  if(clicks >= content){ document.getElementById("btn2").remove(); };

};

//User Selection Stuff
//=============================================================================
var user_choice1 = false;
var user_choice2 = false;
var user_choice3 = false;

user_choose1 = function(keyword) {
  user_choice1 = keyword;
}

user_choose2 = function(keyword) {
  user_choice2 = keyword;
}

user_choose3 = function(keyword) {
  user_choice3 = keyword;
  console.log(user_choice1, user_choice2, user_choice3);
}

load_video_page = function() {
  get_video_page(user_choice1, user_choice2, user_choice3);
  //window.location.href = "/" + user_choice1 + "-" + user_choice2 + "-" + user_choice3 + ".html"
  //window.location.href = "/economics-rental-prices.html"
}

var printthetruth = function() {
  if (user_choice1 == false) {
    console.log('false')
  } else {
    load_second_keywords();
  };
}

load_keywords = function() {
  var getkeywords = new XMLHttpRequest();
  getkeywords.open("GET", "assets/text/keywords.txt", false);
  getkeywords.send()
  keywords = JSON.parse(getkeywords.responseText);

  for (var i = 0; i < keywords.keywords.length; i++) {
    var text = document.createTextNode(keywords.keywords[i]);
    var div = document.createElement('button');
    var container = document.getElementById('buttons');
    div.setAttribute("class", "selector button");
    div.setAttribute("type", "button");
    div.setAttribute("onclick", "user_choose1(\'" + keywords.keywords[i] + "\')");
    container.appendChild(div);
    div.appendChild(text);
  };
};

load_second_keywords = function() {
  var body = document.getElementById("buttons");
  body.innerHTML = '';

  var getkeywords = new XMLHttpRequest();
  getkeywords.open("GET", "/assets/text/" + user_choice1 + "_keywords.txt", false);
  getkeywords.send();
  keywords = JSON.parse(getkeywords.responseText);

  for (var i = 0; i < keywords.keywords.length; i++) {
    var text = document.createTextNode(keywords.keywords[i])
    var div = document.createElement('button')
    var container = document.getElementById('buttons')
    div.setAttribute("class", "selector button")
    div.setAttribute("onclick", "user_choose2(\'" + keywords.keywords[i] + "\')")
    container.appendChild(div)
    div.appendChild(text)
  }

  printthetruth = function() {
    if (user_choice2 == false) {
      console.log('false')
    } else {
      load_respondents();
    };
  }
}

load_respondents = function() {
  var body = document.getElementById("buttons");
  body.innerHTML = '';

  var getrespondents = new XMLHttpRequest();
  getrespondents.open("GET", "assets/text/respondents.txt", false);
  getrespondents.send()
  respondents = JSON.parse(getrespondents.responseText);

  for (var i = 0; i < respondents.respondents.length; i++) {
    var text = document.createTextNode(respondents.respondents[i])
    var div = document.createElement('button')
    var container = document.getElementById('buttons')
    div.setAttribute("class", "selector button")
    div.setAttribute("onclick", "user_choose3(\'" + respondents.respondents[i] + "\')")
    container.appendChild(div)
    div.appendChild(text)
  }

  printthetruth = function() {
    if (user_choice3 == false) {
      console.log('false')
    } else {
      load_video_page();
    };
  }
}

//BELOW the video player javascript
//===========================================================================

function changeVid(uc1, uc2, uc3) {
  window.stop();
  video = document.getElementById('video-content');
  video.pause();
  document.querySelector("#video-content > source").src="/assets/videos/mock_ivs/"+ uc1 + "-" + uc2 + "-" + uc3 +".mp4";
  var v = video.querySelectorAll('source');
    if (v.length !== 0) {
        var lastV = v[v.length-1];
        lastV.addEventListener('error', function() {
            alert('Uh oh, Yuqing has ran away with the doctor! Who! Exactly!');
        });
    }
  video.load();
}

function pauseVid() {
  video = document.getElementById('video-content');
  control = document.getElementById('video-control');
  control.setAttribute('onclick', 'return playVid()');
  video.pause();

}

function playVid() {
  video = document.getElementById('video-content');
  control = document.getElementById('video-control');
  control.setAttribute('onclick', 'return pauseVid()');
  video.play();

}

function stopEverything() {
  pauseVid();
  window.stop();
}

//=============================================================================


//kick everything off once everything has loaded!

window.onload = load_keywords();


//Bonus content!!!
//=============================================================================
function fixEverything() {
  //code to follow
}

function panicJerks() {
  console.log("Everybody freak the fuck out!")
}

function bieberfy() {
  var giphyRequest = new XMLHttpRequest();

  var niko = document.getElementById('niko')
  var iman = document.getElementById('iman')
  var joseph = document.getElementById('joseph')
  var ruyue = document.getElementById('ruyue')
  var yuqing = document.getElementById('yuqing')
  giphyRequest.open("GET", 'http://api.giphy.com/v1/gifs/search?q=bieber&api_key=dc6zaTOxFJmzC', false);
  giphyRequest.send();
  giphyTitleJSON = JSON.parse(giphyRequest.responseText);
  try {
    giphyTitle = giphyTitleJSON.data[4].images.fixed_height.url;
  } catch(err) {
    giphyTitle = "http://i.giphy.com/YyKPbc5OOTSQE.gif"
  }

  var sidebar = document.getElementById('sidebar-wrapper')
  var bonusDiv = document.createElement('div')
  bonusDiv.innerHTML = "<img src= \"" + giphyTitle + "\"/>"
  bonusDiv.setAttribute("class", "facts-and-figures")
  sidebar.appendChild(bonusDiv)

  niko.style.backgroundImage = "url(_obsolete/bae/001.jpg)"
  niko.setAttribute("id", "bieber")
  iman.style.backgroundImage = "url(_obsolete/bae/002.jpg)"
  iman.setAttribute("id", "bieber")
  joseph.style.backgroundImage = "url(_obsolete/bae/003.jpeg)"
  joseph.setAttribute("id", "bieber")
  ruyue.style.backgroundImage = "url(_obsolete/bae/004.jpeg)"
  ruyue.setAttribute("id", "bieber")
  yuqing.style.backgroundImage = "url(_obsolete/bae/005.jpg)"
  yuqing.setAttribute("id", "bieber")

  window.stop();
  video = document.getElementById('video-content');
  video.pause();
  document.querySelector("#video-content > source").src="/_obsolete/bae/waun.mp4";
  video.load();

};
