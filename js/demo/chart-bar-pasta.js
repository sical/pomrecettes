Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

var JSONItems = [];
var ingredientsList = [];
var e;
var strUser;
var selectIngredients = "Tous sélectionner";
var recettesArray = []

window.onload = function() {

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        $.getJSON( "./data/Pasta_small.json", function( data){
            function createAndModifyDivs() {
                var text = "<div class=\"container-fluid\">"
                var progress1 = "<div class=\"card-footer small text-muted\"><div class=\"progress\">";
                var progress2 = "<div class=\"progress-bar bg-info\" role=\"progressbar\" style=\"width: 15%\"  title=\"Temps de préparation\" aria-valuenow=\"15\" aria-valuemin=\"0\" aria-valuemax=\"100\" data-toggle=\"tooltip\" data-placement=\"top\">";
                var progress3 = "<span class=\"progress-type\">15 min</span></div>";
                var progress4 = "<div class=\"progress-bar bg-danger\" role=\"progressbar\" style=\"width: 45%\" title=\"Temps de cuisson\" aria-valuenow=\"45\" aria-valuemin=\"0\" aria-valuemax=\"100\" data-toggle=\"tooltip\" data-placement=\"top\">";
                var progress5 = "<span class=\"progress-type\">45 min</span></div></div></div>";
                var progress = progress1+progress2+progress3+progress4+progress5;


                var tangle1 = "<p id=\"pruneaux\"> Pour <span data-var=\"person\" class=\"TKAdjustableNumber\" data-min=\"2\" data-max=`\"100\"> personnes</span>, il faut <span data-var=\"pruneaux\"></span> g de pruneaux</p><div id=\"categories\"></div>"
                for (var i =0; i < data.length; i ++) {
                    text += "<div class=\"card mb-3\"><div class=\"card-header\"><i class=\"fas fa-chart-bar\"></i>"+" "+data[i].title+"</div><div class=\"card-body\"><canvas id=\"myBarChart"+i+"\" width=\"100%\" height=\"30\"></canvas></div>";
                    text+=progress;
                    text+="<p id=\"pruneaux"+i+"\"> Pour <span data-var=\"person\" class=\"TKAdjustableNumber\" data-min=\"2\" data-max=\"100\"> personnes</span>, il y a  <span data-var=\"pruneaux"+i+"\"></span> calories</p><div id=\"categories\"></div>";
                    text+="</div>";
                }
                text += "</div>"
                document.getElementById("content-wrapper").innerHTML = text;

                var selectiontext="<li class=\"nav-item dropdown\">"
                selectiontext+="<a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"pagesDropdown\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">"
                selectiontext+="<i class=\"fas fa-fw fa-folder\"></i><span>Recettes</span></a>"
                selectiontext+="<div class=\"dropdown-menu\" aria-labelledby=\"pagesDropdown\">"
                selectiontext+="<a class=\"dropdown-item\" id=\"cookies\" href=\"index.html\">Cookies</a>"
                selectiontext+="<a class=\"dropdown-item\" id=\"sandwichs\" href=\"sandwich.html\">Sandwichs</a><a class=\"dropdown-item\" id=\"pasta\"href=\"pasta.html\">Pasta</a></div></li>"
                selectiontext+="<li class=\"nav-item dropdown\">"
                selectiontext+="<a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"pagesDropdown\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">"
                selectiontext+="<i class=\"fas fa-fw fa-folder\"></i><span>Type</span></a>"
                selectiontext+="<div class=\"dropdown-menu\" aria-labelledby=\"pagesDropdown\">"
                selectiontext+="<a class=\"dropdown-item\" id=\"sandwichs\" href=\"sale.html\">Salée</a>"
                selectiontext+="<a class=\"dropdown-item\" id=\"pasta\"href=\"sucre.html\">Sucrée</a>"
                selectiontext+="<a class=\"dropdown-item\" id=\"cookies\" href=\"vegetarian.html\">Végétarienne</a>"
                selectiontext+="</div></li>"
                
                // selectiontext+="<br></br>"

                /*     FILTRE SELECTION   */
                selectiontext+="<form><select id= \"ingredients\" size=\"15\" name=\"ingredients\" multiple>"
                $.each(data, function (index, value) { 
                    $.each(data[index].ingredients, function (ingredientsName, quantite) 
                        { 
                            ingredientsList.push(ingredientsName) ;
                        }) 
                }) 
                selectiontext+="<option>";
                selectiontext+= "Tous sélectionner";
                selectiontext+="</option>";
                for(var j=0; j<ingredientsList.length;j++){
                    
                    
                    selectiontext+="<option>";
                    selectiontext+= ingredientsList[j];
                    selectiontext+="</option>";
                }
                selectiontext+="</select></form>"
                // range
                selectiontext+="<form class=\"slidecontainer\">"
                selectiontext+="<input type=\"range\" min=\"1\" max=\"100\" value=\"50\" class=\"slider\" id=\"myRange\"/>"
                selectiontext+="<p id=\"value\">Temps: <span id=\"demo\"></span> min</p></div>"
                selectiontext+="</form></ul>"

                document.getElementById("leftColonne").innerHTML = selectiontext;
                e = document.getElementById("ingredients");
                console.log(selectIngredients)
                e.addEventListener("change", function (event) {
                    e = document.getElementById("ingredients");
                    selectIngredients = e.options[e.selectedIndex].text;
                    console.log(selectIngredients)
                    afficheFiltre();
                })

                var slider = document.getElementById("myRange");
                var output = document.getElementById("demo");
                output.innerHTML = slider.value;

                slider.oninput = function() {
                    output.innerHTML = this.value;
                }
            }
            createAndModifyDivs();
            //Tangle
            for ( var i =0; i <data.length;i++){
                var element = document.getElementById("pruneaux"+i);
                var tangle = new Tangle(element, {
                    initialize: function () {
                        this.person = 4;
                        this.quantitePerPerson = data[i].calories;
                    },
                    update: function () {
                        //A REVOIR POUR AUTOMATISER
                        this.pruneaux0 = this.person * this.quantitePerPerson;
                        this.pruneaux1 = this.person * this.quantitePerPerson;
                        this.pruneaux2 = this.person * this.quantitePerPerson;
                        this.pruneaux3 = this.person * this.quantitePerPerson;
                        this.pruneaux4 = this.person * this.quantitePerPerson;
                    }
                });
            }
            //Charts
            afficheChart();
        });
    });
}

function afficheChart () {
    
    $.getJSON( "./data/Pasta_small.json", function (data) {
        $.each(data, function (index, value) {
            labels = []
            datas = []
            let found = false;
            $.each(data[index].ingredients, function (ingredientsName, quantite) {
                labels.push(ingredientsName)
                datas.push(quantite)
            })
            recettesArray.push({
                title: data[index].title,
                labels: labels,
                datas: datas
            })
        })
        // recettesArray -> afficher le bar chart
        for (var i = 0; i < recettesArray.length; i++) {
            var ctx = document.getElementById('myBarChart' + i) // ton element
            let myLineChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: recettesArray[i].labels,
                datasets: [{
                    label: 'Cup/Value',
                    backgroundColor: 'rgba(2,117,216,1)',
                    borderColor: 'rgba(2,117,216,1)',
                    data: recettesArray[i].datas
                }]
            },
            options: {
                scales: {
                xAxes: [{
                    time: {
                    unit: 'Unit'
                    },
                    gridLines: {
                    display: false
                    },
                    ticks: {
                    maxTicksLimit: 15
                    }
                }],
                yAxes: [{
                    ticks: {
                    min: 0,
                    max: 15,
                    maxTicksLimit: 5
                    },
                    gridLines: {
                    display: true
                    }
                }]
                },
                legend: {
                display: false
                }
            }
            })
        }
    }) 
}

function afficheFiltre() {
    var isAffiche = []
    $.each(recettesArray, function (index, value) {
        let found = false
        isAffiche[index] = false
        $.each(recettesArray[index].labels, function (index, ingredientsName) {
            if (ingredientsName === selectIngredients) {
                found = true
            }
        })
        if (found || selectIngredients === "Tous sélectionner") {
            isAffiche[index] = true
        }
    })
    for (var i = 0; i < recettesArray.length; i++) {
        var ctx = document.getElementById('myBarChart' + i) // ton element
        var parent = ctx.parentNode.parentNode
        if (isAffiche[i]) {
            if ( parent.classList.contains('hidden') ) {
                parent.classList.remove('hidden')
            }
            let myLineChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: recettesArray[i].labels,
                datasets: [{
                    label: 'Cup/Value',
                    backgroundColor: 'rgba(2,117,216,1)',
                    borderColor: 'rgba(2,117,216,1)',
                    data: recettesArray[i].datas
                }]
            },
            options: {
                scales: {
                xAxes: [{
                    time: {
                    unit: 'Unit'
                    },
                    gridLines: {
                    display: false
                    },
                    ticks: {
                    maxTicksLimit: 15
                    }
                }],
                yAxes: [{
                    ticks: {
                    min: 0,
                    max: 15,
                    maxTicksLimit: 5
                    },
                    gridLines: {
                    display: true
                    }
                }]
                },
                legend: {
                display: false
                }
            }
            })
        } else {
            if ( !parent.classList.contains('hidden') ) {
                parent.classList.add('hidden')
            }
        }
    }
}
