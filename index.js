//Configuring Firebase application
var config = {
    apiKey: "AIzaSyBuBrpKvwMMnMJWjGf4UsJFZPYGaiVm250",
    authDomain: "fir-js-13ecc.firebaseapp.com",
    databaseURL: "https://fir-js-13ecc.firebaseio.com",
    projectId: "fir-js-13ecc",
    storageBucket: "fir-js-13ecc.appspot.com",
    messagingSenderId: "218732343795"
};
firebase.initializeApp(config);

var currentuseremail = ""; // a global variable to store current user emil ID
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        currentuseremail = user.email;
        //Allow only authenticated user to view data
        if (user.email == "sraghudatta94@gmail.com") {
            //Show sidebar,feture div & hide login screen
            document.getElementById("user_div").style.display = "block";
            document.getElementById("login_div").style.display = "none";
            document.getElementById("noaccessdiv").style.display = "none";
        }
        //
        else {
            //Hide all show no worker access DIV
            console.log("Wrong authentication");
            document.getElementById("user_div").style.display = "none";
            document.getElementById("login_div").style.display = "none";
            document.getElementById("noaccessdiv").style.display = "block";

        }


        var user = firebase.auth().currentUser;
        if (user != null) {
            var email_id = user.email;
            document.getElementById("user_para").innerHTML = "Hi " + email_id;
            console.log(user);
        }

    } else {
        // No user is signed in.
        document.getElementById("user_div").style.display = "none";
        document.getElementById("login_div").style.display = "block";
    }
});
//Login function
function login() {

    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;

        var errorMessage = error.message;
        window.alert("Error : " + errorMessage);
    });

}
//Logout function
function logout() {
    firebase.auth().signOut();
    document.getElementById("noaccessdiv").style.display = "none";
}

var database = firebase.database(); //Get database reference
//Load all customer data
function loadcustomer() {
    //Only admin can see customer data
    if (currentuseremail == "sraghudatta94@gmail.com") {
        database.ref('customers').on('child_added', function(data) {
            add_data_table(data.val().customername, data.val().customertype, data.val().phonenumber, data.val().whatsappnumber, data.val().address, data.val().pincode, data.val().email, data.key);
        });
        database.ref('customers').on('child_changed', function(data) {
            update_data_table(data.val().customername, data.val().customertype, data.val().phonenumber, data.val().whatsappnumber, data.val().address, data.val().pincode, data.val().email, data.key);
        });
        database.ref('customers').on('child_removed', function(data) {
            remove_data_table(data.key)
        });
    }
    //Worker cant see customer data
    else {
        console.log("In load customer you are not authorised to see " + currentuseremail);
    }

}
//Add entered data to customer table in HTML
function add_data_table(customername, customertype, phonenumber, whatsappnumber, address, pincode, email, phonenumber) {
    $("#custable").append('<tr id="' + phonenumber + '"><th>' + customername + '</th><th>' + customertype + '</th><th>' + phonenumber + '</th><th>' + whatsappnumber + '</th><th>' + address + '</th><th>' + pincode + '</th><th>' + email + '</th><th><a href="#" data-key="' + phonenumber + '" class="card-footer-item btnEdit">Edit</a></th><th><a href="#" class="card-footer-item btnRemove"  data-key="' + phonenumber + '">Remove</a></th></tr>');
}
//Update entered data to customer table in HTML
function update_data_table(customername, customertype, phonenumber, whatsappnumber, address, pincode, email, phonenumber) {
    $("#custable #" + phonenumber).html('<th>' + customername + '</th><th>' + customertype + '</th><th>' + phonenumber + '</th><th>' + whatsappnumber + '</th><th>' + address + '</th><th>' + pincode + '</th><th>' + email + '</th><th><a href="#" data-key="' + phonenumber + '" class="card-footer-item btnEdit">Edit</a></th><th><a href="#" class="card-footer-item btnRemove"  data-key="' + phonenumber + '">Remove</a></th>');
}
//Remove desired data from customer table in HTML
function remove_data_table(phonenumber) {
    $("#custable #" + phonenumber).remove();
}
/**DB operations for Customer **/
//new customer data
function new_data(customername, customertype, phonenumber, whatsappnumber, address, pincode, email, phonenumber) {
    if (currentuseremail == "sraghudatta94@gmail.com") {
        database.ref('customers/' + phonenumber).set({
            customername: customername,
            customertype: customertype,
            phonenumber: phonenumber,
            whatsappnumber: whatsappnumber,
            address: address,
            pincode: pincode,
            email: email
        });
    } else {
        console.log("triggered");
    }

}
//Update customer data
function update_data(customername, customertype, phonenumber, whatsappnumber, address, pincode, email, key) {
    database.ref('customers/' + phonenumber).update({
        customername: customername,
        customertype: customertype,
        phonenumber: phonenumber,
        whatsappnumber: whatsappnumber,
        address: address,
        pincode: pincode,
        email: email
    });
}
$("#btnAdd").click(function() {
    $("#txtcustomerName").val("");
    $("#txtcustomerType").val("");
    $("#txtPhoneNumber").val("");
    $("#txtWhatsappNumber").val("");
    $("#txtAddress").val("");
    $("#txtPincode").val("");
    $("#txtEmail").val("");
    $("#txtType").val("N");
    $("#txtKey").val("0");
    $("#modal").addClass("is-active");
});
$("#btnSave").click(function() {
    if ($("#txtType").val() == 'N') {
        database.ref('customers').once("value").then(function(snapshot) {
            new_data($("#txtcustomerName").val(), $("#txtcustomerType").val(), $("#txtPhoneNumber").val(), $("#txtWhatsappNumber").val(), $("#txtAddress").val(), $("#txtPincode").val(), $("#txtEmail").val(), $("#txtPhoneNumber").val());
        });
    } else {
        update_data($("#txtcustomerName").val(), $("#txtcustomerType").val(), $("#txtPhoneNumber").val(), $("#txtWhatsappNumber").val(), $("#txtAddress").val(), $("#txtPincode").val(), $("#txtEmail").val(), $("#txtPhoneNumber").val());
    }
    $("#txtPhoneNumber").prop("readonly", false);
    $("#btnClose").click();
});
$(document).on("click", ".btnEdit", function(event) {
    event.preventDefault();
    key = $(this).attr("data-key");
    $("#txtPhoneNumber").prop("readonly", true);
    database.ref('customers/' + key).once("value").then(function(snapshot) {
        $("#txtcustomerName").val(snapshot.val().customername);
        $("#txtcustomerType").val(snapshot.val().customertype);
        $("#txtPhoneNumber").val(snapshot.val().phonenumber);
        $("#txtWhatsappNumber").val(snapshot.val().whatsappnumber);
        $("#txtAddress").val(snapshot.val().address);
        $("#txtPincode").val(snapshot.val().pincode);
        $("#txtEmail").val(snapshot.val().email);
        $("#txtType").val("E");
        $("#txtKey").val(key);
    });
    $("#modal").addClass("is-active");
});
$(document).on("click", ".btnRemove", function(event) {
    event.preventDefault();
    key = $(this).attr("data-key");
    database.ref('customers/' + key).remove();
})
$("#btnClose,.btnClose").click(function() {
    $("#modal").removeClass("is-active");
});
/*************seller management***************/
function loadseller() {
    database.ref('sellers').on('child_added', function(data) {
        add_seller_data_table(data.val().sellername, data.val().companyname, data.val().phonenumber, data.val().whatsappnumber, data.val().address, data.val().pincode, data.val().email, data.key);

    });
    database.ref('sellers').on('child_changed', function(data) {
        update_seller_data_table(data.val().sellername, data.val().companyname, data.val().phonenumber, data.val().whatsappnumber, data.val().address, data.val().pincode, data.val().email, data.key);
    });
    database.ref('sellers').on('child_removed', function(data) {
        remove_seller_data_table(data.key)
    });
}

function add_seller_data_table(sellername, companyname, phonenumber, whatsappnumber, address, pincode, email, phonenumber) {
    $("#sellertable").append('<tr id="' + phonenumber + '"><th>' + sellername + '</th><th>' + companyname + '</th><th>' + phonenumber + '</th><th>' + whatsappnumber + '</th><th>' + address + '</th><th>' + pincode + '</th><th>' + email + '</th><th><a href="#" data-key="' + phonenumber + '" class="card-footer-item btnEdit">Edit</a></th><th><a href="#" class="card-footer-item btnRemove"  data-key="' + phonenumber + '">Remove</a></th></tr>');
}

function update_seller_data_table(sellername, companyname, phonenumber, whatsappnumber, address, pincode, email, phonenumber) {
    $("#sellertable #" + phonenumber).html('<th>' + sellername + '</th><th>' + companyname + '</th><th>' + phonenumber + '</th><th>' + whatsappnumber + '</th><th>' + address + '</th><th>' + pincode + '</th><th>' + email + '</th><th><a href="#" data-key="' + phonenumber + '" class="card-footer-item btnEdit">Edit</a></th><th><a href="#" class="card-footer-item btnRemove"  data-key="' + phonenumber + '">Remove</a></th>');
}

function remove_seller_data_table(phonenumber) {
    $("#sellertable #" + phonenumber).remove();
}

function new_seller_data(sellername, companyname, phonenumber, whatsappnumber, address, pincode, email, phonenumber) {
    database.ref('sellers/' + phonenumber).set({
        sellername: sellername,
        companyname: companyname,
        phonenumber: phonenumber,
        whatsappnumber: whatsappnumber,
        address: address,
        pincode: pincode,
        email: email
    });
}

function update_seller_data(sellername, companyname, phonenumber, whatsappnumber, address, pincode, email, key) {
    database.ref('sellers/' + phonenumber).update({
        sellername: sellername,
        companyname: companyname,
        phonenumber: phonenumber,
        whatsappnumber: whatsappnumber,
        address: address,
        pincode: pincode,
        email: email
    });
}
$("#btnSellerAdd").click(function() {
    $("#txtSellerName").val("");
    $("#txtSellerCompanyName").val("");
    $("#txtSellerPhoneNumber").val("");
    $("#txtSellerWhatsappNumber").val("");
    $("#txtSellerAddress").val("");
    $("#txtSellerPincode").val("");
    $("#txtSellerEmail").val("");
    $("#txtSellerType").val("N");
    $("#txtSellerKey").val("0");
    $("#modal").addClass("is-active");
});
$("#btnSellerSave").click(function() {
    if ($("#txtSellerType").val() == 'N') {
        database.ref('sellers').once("value").then(function(snapshot) {
            new_seller_data($("#txtSellerName").val(), $("#txtSellerCompanyName").val(), $("#txtSellerPhoneNumber").val(), $("#txtSellerWhatsappNumber").val(), $("#txtSellerAddress").val(), $("#txtSellerPincode").val(), $("#txtSellerEmail").val(), $("#txtSellerPhoneNumber").val());
        });
    } else {
        update_seller_data($("#txtSellerName").val(), $("#txtSellerCompanyName").val(), $("#txtSellerPhoneNumber").val(), $("#txtSellerWhatsappNumber").val(), $("#txtSellerAddress").val(), $("#txtSellerPincode").val(), $("#txtSellerEmail").val(), $("#txtSellerPhoneNumber").val());
    }
    $("#btnSellerClose").click();
});
$(document).on("click", ".btnEdit", function(event) {
    event.preventDefault();
    key = $(this).attr("data-key");
    database.ref('sellers/' + key).once("value").then(function(snapshot) {
        $("#txtSellerName").val(snapshot.val().sellername);
        $("#txtSellerCompanyName").val(snapshot.val().companyname);
        $("#txtSellerPhoneNumber").val(snapshot.val().phonenumber);
        $("#txtSellerWhatsappNumber").val(snapshot.val().whatsappnumber);
        $("#txtSellerAddress").val(snapshot.val().address);
        $("#txtSellerPincode").val(snapshot.val().pincode);
        $("#txtSellerEmail").val(snapshot.val().email);
        $("#txtSellerType").val("E");
        $("#txtSellerKey").val(key);
    });
    $("#modal").addClass("is-active");
});
$(document).on("click", ".btnRemove", function(event) {
    event.preventDefault();
    key = $(this).attr("data-key");
    database.ref('sellers/' + key).remove();
})
$("#btnSellerClose,.btnSellerClose").click(function() {
    $("#modal").removeClass("is-active");
});
/*******seller management ends************/
//showcategorydata
var categoryarray = [];
var subcategoryarray = [];
var companynames =[];
var itemcodes= [];
var currentunitconfig="";
function showcategorydata(name,type){
  if(type=="Category"){
    categoryarray.push(name);
  }
  else if(type=="Sub-Category"){
    subcategoryarray.push(name);
  }
}
function showcompanyname(name){
  companynames.push(name);
}
function showitemcodes(code){
  itemcodes.push(code);
}
function getunitconfig(unit){
currentunitconfig=unit;
}
database.ref('categories').on('child_added', function(data) {
showcategorydata(data.val().name,data.val().type);
});
database.ref('sellers').on('child_added', function(data) {
showcompanyname(data.val().companyname);
});
database.ref('products').on('child_added', function(data) {
showitemcodes(data.val().itemcode);
});
/*database.ref('products').on('child_added', function(data) {
getunitconfig(data.val().unit);
});*/
function returnCurrentUnit(){
  $('#showunitsdiv').empty();
  database.ref('products').on('child_added', function(data) {
    var itemcode= $("#itemcode").val();
  if(data.val().itemcode ==itemcode){
    getunitconfig(data.val().unit);
  }
  });
  if(currentunitconfig=="Case-Tin"){

    $("#showunitsdiv").append('<input id="case" type="text" placeholder="Case"/><input id="tin" type="text" placeholder="Tin"/>');
  }
  else if(currentunitconfig=="Case-Piece"){

    $("#showunitsdiv").append('<input id="case" type="text" placeholder="Case"/><input id="piece" type="text" placeholder="Piece"/>');
  }
  else if(currentunitconfig=="Case-Box-Piece"){

    $("#showunitsdiv").append('<input id="case" type="text" placeholder="Case"/><input id="box" type="text" placeholder="Box"/><input id="piece" type="text" placeholder="Piece"/>');
  }
  else if(currentunitconfig=="Case-Packets"){

    $("#showunitsdiv").append('<input id="case" type="text" placeholder="Case"/><input id="packets" type="text" placeholder="Packets"/>');
  }
  else if(currentunitconfig=="Bundle-Katta-Boxes"){

    $("#showunitsdiv").append('<input id="bundle" type="text" placeholder="Bundle"/><input id="katta" type="text" placeholder="Katta"/><input id="box" type="text" placeholder="Box"/>');
  }
  else if(currentunitconfig=="Bundle-Boxes"){

    $("#showunitsdiv").append('<input id="bundle" type="text" placeholder="Bundle"/><input id="box" type="text" placeholder="Box"/>');
  }
  else if(currentunitconfig=="Bag-Kgs"){

    $("#showunitsdiv").append('<input id="bag" type="text" placeholder="Bag"/><input id="kgs" type="text" placeholder="Kgs"/>');
  }
  else if(currentunitconfig=="Case-Cent-Katta"){

    $("#showunitsdiv").append('<input id="case" type="text" placeholder="Case"/><input id="cent" type="text" placeholder="Cent"/><input id="katta" type="text" placeholder="Katta"/>');
  }
  else if(currentunitconfig=="Case-Tube"){

    $("#showunitsdiv").append('<input id="case" type="text" placeholder="Case"/><input id="tube" type="text" placeholder="Tube"/>');
  }
  else if(currentunitconfig=="Case-Cone"){

    $("#showunitsdiv").append('<input id="case" type="text" placeholder="Case"/><input id="cone" type="text" placeholder="Cone"/>');
  }
  else if(currentunitconfig=="Bag-Pieces"){

    $("#showunitsdiv").append('<input id="bag" type="text" placeholder="Bag"/><input id="piece" type="text" placeholder="Piece"/>');
  }
  else if(currentunitconfig=="Bag-Packets"){

    $("#showunitsdiv").append('<input id="bag" type="text" placeholder="Bag"/><input id="packets" type="text" placeholder="Packets"/>');
  }
  else{
    $("#showunitsdiv").append('<h1>Issue in selection</h1>');
  }
  //$("#showunitsdiv").append('<h1>'+currentunitconfig+'</h1>')
  console.log($("#itemcode").val()+" "+currentunitconfig);
}
/*Autocomplete*/
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      /*document.getElementById('autocompletetagshere').appendChild("DIV");*/

      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      document.getElementById('autocompletetagshere').appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
      });
}
database.ref('categories').on('child_added', function(data) {
  add_categories_data_table(data.val().name,data.val().type);
});
database.ref('categories').on('child_changed', function(data) {
  update_categories_data_table(data.val().name,data.val().type);
});
database.ref('categories').on('child_removed', function(data) {
  remove_categories_data_table(data.key)
});

function add_categories_data_table(name,type){
  $("#Catcustable").append('<tr id="'+name+'"><th>'+name+'</th><th>'+type+'</th><th><a href="#" data-key="'+name+'" class="card-footer-item btnCatEdit">Edit</a></th><th><a href="#" class="card-footer-item btnCatRemove"  data-key="'+name+'">Remove</a></th></tr>');
}
function update_categories_data_table(name,type){	$("#Catcustable #"+name).html('<th>'+name+'</th><th>'+type+'</th><th><a href="#" data-key="'+name+'" class="card-footer-item btnCatEdit">Edit</a></th><th><a href="#" class="card-footer-item btnCatRemove"  data-key="'+name+'">Remove</a></th>');
}
function remove_categories_data_table(name){
  $("#Catcustable #"+name).remove();
}
function new_data(name,type){
  database.ref('categories/' + name).set({
    name: name,
    type: type
  });
}
function update_data(name,type){
  database.ref('categories/' + name).update({
    name: name,
    type : type
  });
  console.log(name);
}
$( "#btnCatAdd" ).click(function() {

});

$("#btnCatSave" ).click(function() {
  if($("#txtType").val() == 'N'){
    database.ref('categories').once("value").then(function(snapshot) {

      new_data($("#txtCatname").val(),$("#txtCattype").val());
    });
  }else{
    update_data($("#txtCatname").val(),$("#txtCattype").val());
    //window.location.reload();
  }
});
$(document).on("click",".btnCatEdit",function(event){
  event.preventDefault();
  key = $(this).attr("data-key");
  console.log("key is "+key);
  database.ref('categories/'+key).once("value").then(function(snapshot){
    $("#txtCatname").val(snapshot.val().name);
    $("#txtCattype").val(snapshot.val().type);
  });
});
$(document).on("click",".btnCatRemove",function(event){
  event.preventDefault();
  key = $(this).attr("data-key");
  database.ref('categories/' + key).remove();
})
/********Add products logic****/
database.ref('products').on('child_added', function(data) {
  add_products_data_table(data.val().name,data.val().itemcode,data.val().companyname,data.val().category,data.val().subcategory,data.val().unit,data.val().comment);
});
database.ref('products').on('child_changed', function(data) {
  update_products_data_table(data.val().name,data.val().itemcode,data.val().companyname,data.val().category,data.val().subcategory,data.val().unit,data.val().comment);
});
database.ref('products').on('child_removed', function(data) {
  remove_products_data_table(data.key)
});

function add_products_data_table(name,itemcode,companyname,category,subcategory,unit,comment){
  $("#ProductTable").append('<tr id="'+itemcode+'"><th>'+name+'</th><th>'+itemcode+'</th><th>'+companyname+'</th><th>'+category+'</th><th>'+subcategory+'</th><th>'+unit+'</th><th>'+comment+'</th><th><a href="#" data-key="'+itemcode+'" class="card-footer-item btnProductEdit">Edit</a></th><th><a href="#" class="card-footer-item btnProductRemove"  data-key="'+itemcode+'">Remove</a></th></tr>');
}
function update_products_data_table(name,itemcode,companyname,category,subcategory,unit,comment){
  	$("#ProductTable #"+itemcode).html('<th>'+name+'</th><th>'+itemcode+'</th><th>'+companyname+'</th><th>'+category+'</th><th>'+subcategory+'</th><th>'+unit+'</th><th>'+comment+'</th><th><a href="#" data-key="'+itemcode+'" class="card-footer-item btnProductEdit">Edit</a></th><th><a href="#" class="card-footer-item btnProductRemove"  data-key="'+itemcode+'">Remove</a></th>');
}
function remove_products_data_table(itemcode){
  $("#ProductTable #"+itemcode).remove();
}
function new_product_data(name,itemcode,companyname,category,subcategory,unit,comment){
  database.ref('products/' + itemcode).set({
    name: name,
    itemcode: itemcode,
    companyname: companyname,
    category: category,
    subcategory: subcategory,
    unit: unit,
    comment: comment
  });
}
function update_product_data(name,itemcode,companyname,category,subcategory,unit,comment){
  database.ref('products/' + itemcode).update({
    name: name,
    itemcode: itemcode,
    companyname: companyname,
    category: category,
    subcategory: subcategory,
    unit: unit,
    comment: comment
  });
}
$( "#btnProductAdd" ).click(function() {

});

$("#btnProductSave" ).click(function() {
  if($("#txtType").val() == 'N'){
    database.ref('products').once("value").then(function(snapshot) {
      new_product_data($("#productname").val(),$("#itemcode").val(),$("#companynameInput").val(),$("#categoriesInput").val(),$("#subcategoriesInput").val(),$("#unitconversion").val(),$("#itemcomment").val());
    });
    $("#productname").val("");
    $("#itemcode").val("");
    $("#companynameInput").val("");
    $("#categoriesInput").val("");
    $("#subcategoriesInput").val("");
    $("#unitconversion").val("");
    $("#itemcomment").val("");
  }else{

    update_product_data($("#productname").val(),$("#itemcode").val(),$("#companynameInput").val(),$("#categoriesInput").val(),$("#subcategoriesInput").val(),$("#unitconversion").val(),$("#itemcomment").val());
    //window.location.reload();
    $("#productname").val("");
    $("#itemcode").val("");
    $("#companynameInput").val("");
    $("#categoriesInput").val("");
    $("#subcategoriesInput").val("");
    $("#unitconversion").val("");
    $("#itemcomment").val("");
  }
});
$(document).on("click",".btnProductEdit",function(event){
  event.preventDefault();
  key = $(this).attr("data-key");
  console.log("key is "+key);
  database.ref('products/'+key).once("value").then(function(snapshot){
    $("#productname").val(snapshot.val().name);
    $("#itemcode").val(snapshot.val().itemcode);
    $("#companynameInput").val(snapshot.val().companyname);
    $("#categoriesInput").val(snapshot.val().category);
    $("#subcategoriesInput").val(snapshot.val().subcategory);
    $("#unitconversion").val(snapshot.val().unit);
    $("#itemcomment").val(snapshot.val().comment);
  });
});
$(document).on("click",".btnProductRemove",function(event){
  event.preventDefault();
  key = $(this).attr("data-key");
  database.ref('products/' + key).remove();
})
/***Add product logic ends*/
