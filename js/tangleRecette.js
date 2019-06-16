

    function setUpTangle () {
        
        var element = document.getElementById("example");

        var tangle = new Tangle(element, {
            initialize: function () {
                // let res = fnt();
                this.person = 4;
                this.quantitePerPerson = res["value"];
            },
            update: function () {
                this.viandes = this.person * this.quantitePerPerson;
            }
        });
    }


    /*function fnt() {

        // var objet= require("xxx/fichier.json")
        $.getJSON('tartes.json',function(data){
            console.log(data);
            $.each(data,function(index,d){
                $.each(d["ingredients"],function(categorie) {
                    $.each(categorie,function(cle, valeur) {
                        console.log(cle,valeur)
                        return {"cle": cle, "valeur":valeur};
                    });
                    // var tarteTangle = '';

                });
        
            });
        });

    return true;
    }*/


//append