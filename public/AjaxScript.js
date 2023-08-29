console.log("script ok!");
$(function(){
    document.getElementById("boutton2").addEventListener("click",function(){
        var codeaffiche = document.getElementById("codechoisi").value;
       // console.log(codeaffiche);
        $.ajax("/ecoledbajaxRead",{
            type:"GET",
            data:{codeaffiche : codeaffiche},
            success: function(data){
              //  console.log(data.infoclient[0].nom);
                document.getElementById("nom").value=data.infoclient[0].nom;
                document.getElementById("prenom").value=data.infoclient[0].prenom;
            },
            error:function(){
                console.log("error");
            }
        });
    });

    document.getElementById("insert").addEventListener("click",function()  {
             var nom = document.getElementById("nom").value;
             var prenom = document.getElementById("prenom").value;
       
             $.ajax("/ecoledbajaxWrite",{
                 type:"POST", /* Les informations à insérer sont envoyées par post*/
                 data : {nom: nom, prenom: prenom},  
       
                 success: function(data){
                   console.log('ok');
                   window.location.reload();
               //    document.getElementById("nom").value = " ";
               //    document.getElementById("prenom").value = " ";
                 },
                 error:function(){
                   console.log('error!')
                 }
            });
         });

    document.getElementById("update").addEventListener("click",function()  {
             var code = document.getElementById("codechoisi").value;
             var nom = document.getElementById("nom").value;
             var prenom = document.getElementById("prenom").value;
       
             $.ajax("/ecoledbajaxUpdate",{
                 type:"POST", /* Les informations à insérer sont envoyées par post*/
                 data : {code: code, nom: nom, prenom: prenom},  
       
                 success: function(data){
                   console.log('ok');
                   document.getElementById("nom").value=data.infoclient[0].nom;
                   document.getElementById("prenom").value=data.infoclient[0].prenom;
                   window.alert("Update ready !");
                   
                 },
                 error:function(){
                   console.log('error!')
                 }
            });
         });
       
});