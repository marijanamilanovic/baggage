let url = location.href;

function ajaxCallback(file, callback){
    $.ajax({
        url: "js/" + file,
        method: "get",
        dataType: "json",
        success: function(arr){
            callback(arr)
        },
        error: function(jqXHR, exception){
            var msg = "";
            if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
            msg = 'Error 404. Requested page not found.';
            } else if (jqXHR.status == 500) {
            msg = 'Error 500. Internal Server Error.';
            } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
            msg = 'Time out error.';
            } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
            } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            document.getElementById("printError").innerHTML = msg;
        }
    })
}

if(url.indexOf("index.html") != -1){
    //SERVICES 

    try{
        ajaxCallback("services.json", servicesPrint);
    }
    catch{
        document.getElementById("services").innerHTML += `<p>Error loading services! Please try again later.</p>`;
    }

    function servicesPrint(service){
        let print = "";
        service.forEach(s => {
            print += `<div class="col-lg-4 ab-content">
                        <div class="ab-info-con">
                            <h4>${s.title}</h4>
                            <p>${s.description}.</p>
                        </div>
                    </div>`;
        });
        $("#services").html(print);
    }
}


//NAVIGATION

try{
    ajaxCallback("nav.json", navPrint);
}
catch{
    document.getElementById("navPrint").innerHTML += `<p>Error loading navigation! Please try again later.</p>`;
}

function navPrint(navArr){
    let print = `<ul class="menu">`;
    for(let arr of navArr){
        print += `<li><a href="${arr.path}">${arr.name}</a></li>`;
    }
    print += `</ul>`;
    $("#navPrint").html(print);
}

//SOCIALS

ajaxCallback("socials.json", socialsPrint);
function socialsPrint(socialsArr){
    let print = `<ul>`;
    for(let arr of socialsArr){
        print += `<li><a href="${arr.path}"><span class="${arr.icon}"></span></a></li>`;
    }
    print += `</ul>`;
    $("#socialsPrint").html(print);
}

//CONTACT PAGE 

if(url.indexOf("contact.html") != -1){
    window.onload=function(){
        var button = document.getElementById("btnSend");
        button.addEventListener("click", formProcess);        
    }
}

function formProcess(){
    var error = 0;
    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var phone = document.getElementById("phone");
    var ddl = document.getElementById("ddl");
    var chb = document.getElementById("chTerms");

    var reName = /^(([A-ZČĆŽĐŠ][a-zčćžđš]{2,15})+)\s(([A-ZČĆŽĐŠ][a-zčćžđš]{2,15})+)$/;
    var reEmail = /^\w([\.-]?\w+\d*)*@\w+\.\w{2,6}$/;
    var rePhone = /^(\+381|[0])6[\d]{7,8}$/;

    error += checkReggex(reName, name, "The name is invalid. Example: Paul Wesley");
    error += checkReggex(reEmail, email, "The email is invalid. Example: paulwesley@gmail.com");
    error += checkReggex(rePhone, phone, "The phone number is invalid. Example: 0641234567");

    var ddlValue = ddl.options[ddl.selectedIndex].value;
    var ddlText = ddl.options[ddl.selectedIndex].text;

    if(ddlValue == "0"){
        ddl.nextElementSibling.classList.remove("hide");
        ddl.nextElementSibling.innerHTML = "Choose a service.";
        error++;
    }
    else{
        ddl.nextElementSibling.classList.add("hide");
        ddl.nextElementSibling.innerHTML = "";
    }

    let chbValue = "";
    if(chb.checked){
        chbValue = chb.value;
    }
    else{
        error++;
    }

    error += checkCheckedElements(chbValue, chb, "Accept the terms of use.");

    if(error == 0){
        document.getElementById("sendButton").classList.remove("d-none");
        document.getElementById("formProcess").reset();
    }
    else{
        document.getElementById("sendButton").classList.add("d-none");
    }
}

function checkReggex(re, object, p){
    if(re.test(object.value)){
        object.nextElementSibling.classList.add("hide");
        object.nextElementSibling.innerHTML = "";
        return 0;
    }
    else{
        object.nextElementSibling.classList.remove("hide");
        object.nextElementSibling.innerHTML = p;
        return 1;
    }
}

function checkCheckedElements(elementValue, element, p){
    if(elementValue == ""){
        element.parentElement.nextElementSibling.classList.remove("hide");
        element.parentElement.nextElementSibling.innerHTML = p;
        return 1;
    }
    else{
        element.parentElement.nextElementSibling.classList.add("hide");
        element.parentElement.nextElementSibling.innerHTML = "";
        return 0;
    }
}


//SHOP PAGE

if(url.indexOf("shop.html") != -1){
    //LOCAL STORAGE

    function setLS(name, value){
        localStorage.setItem(name, JSON.stringify(value));
    }
    
    function getLS(name){
        return JSON.parse(localStorage.getItem(name));
    }

    window.onload = function(){
        ajaxCallback("options.json", function(result){
            printDDL(result, "sort", "SORT BY:", "sortDiv", "sort");
            setLS("sortValue", result);
        })

        ajaxCallback("brands.json", function(result){
            printDDL(result, "ddlBrand", "FILTER BY BRAND:", "brandDiv", "filter");
            setLS("brands", result);
        })

        ajaxCallback("products.json", function(result){
            productsPrint(result);
            setLS("products", result);
        })

        $(document).on("change", "#sort", onChange);
        $(document).on("change", "#ddlBrand", onChange);
        $(document).on("keyup", "#searchProd", filterBySearch);
    }

    function onChange(){
        let product = getLS("products");
        product = sortProducts(product);
        product = filterProducts(product);

        productsPrint(product);
    }

    //DROPDOWN LIST FOR SORT

    function printDDL(array, ddlId, label, divId, type){
        let print = `<label>${label}</label>
        <select id="${ddlId}">"`;
        for(let a of array){
            if(type == "sort"){
                print += `<option value="${a.value}">${a.name}</option>`;
            }
            else{
                print += `<option value="${a.id}">${a.name}</option>`;
            }
        }
        print += `</select>`;
        document.getElementById(`${divId}`).innerHTML = print;
    }

    // ajaxCallback("options.json", printSortDDL);
    // function printSortDDL(data){
    //     let print = "";
    //     for(let d of data){
    //         print += `<option value="${d.value}">${d.name}</option>`;
    //     }
    //     $("#sort").html(print);
    //     $("#sort").change(onChange);
    // }

    //BRANDS FOR FILTER

    // function printBrandsCHB(data){
    //     let print = `<h5 class="mt-2 mb-1">BRANDS</h5>`;
    //     for(let d of data){
    //         print += `<input type="checkbox" value="${d.id}" name="chb" id="chb${d.id}" class="brand"/>
    //         <label for="${d.name}">${d.name}</label><br/>`;
    //     }
    //     $("#brandDiv").html(print);
    //     brands = data;
    //     $("#brandDiv").change(onChange);
    // }

    //$("#radioDiv").change(onChange);

    //SORT

    function sortProducts(product){
        let sortType = document.getElementById('sort').value;
        switch(sortType){
            case "price-asc" :
                return product.sort((previous, next) => previous.price.current > next.price.current ? 1 : -1)
            case "price-desc" :
                console.log("a");
                return product.sort((previous, next) => previous.price.current < next.price.current ? 1 : -1)
            case "name-desc" :
                return product.sort((previous, next) => previous.name < next.name ? 1 : -1)
            case "name-asc" :
                return product.sort((previous, next) => previous.name > next.name ? 1 : -1)
        }
    }

    //FILTER BY BRAND AND STATUS

    function filterProducts(niz){
        let filteredProducts = [];
        let id = $("#ddlBrand").val();
        let svojstvo = "brand";
    
        if(id == "0"){
            filteredProducts = niz;
        }
        else{
            filteredProducts = niz.filter(p => p[svojstvo] == id);
        }
        return filteredProducts;
    }

    // function filterProducts(product){
    //     let chosenBrands = [];
	// 	let chosenStatuses = [];

	// 	$("input:checkbox[name=chb]:checked").each(function(x) { 
    //         chosenBrands.push(this.value); 
    //     });
	// 	$("input:radio[name=prodRadio]:checked").each(function(){ 
    //         chosenStatuses.push($(this).attr('value')); 
    //     });
	// 	let filteredProducts = product;

	// 	if (chosenBrands.length > 0) {
    //         filteredProducts = filteredProducts.filter((x) => chosenBrands.includes(x.brand))
	// 	}

	// 	if (chosenStatuses.length > 0) {
	// 		filteredProducts = filteredProducts.filter((x) => chosenStatuses.includes(x.status))
	// 	}

    //     return filteredProducts;
    // } 

    //FILTER BY SEARCH

    function filterBySearch(){
        let products = getLS("products");
        let filteredProducts = products.filter(p => {
            if(p.name.toLowerCase().indexOf(document.getElementById("searchProd").value.toLowerCase().trim()) != -1)
            {
                return true;
            }
        })
        productsPrint(filteredProducts);
    }


    //PRODUCTS PRINT

    function productsPrint(product){
        let print = "";
        if(product.length == 0){
            print += `<div class="row">
                        <div id="searchText" class="col-12">
                            <p>There is no product with the selected criteria.</p>
                        </div>
                    </div>`;
        }
        else{
            product.forEach(p => {
                print += `<div class="col-md-4 shop-info-grid text-center mt-4">
                <div class="product-shoe-info shoe">
                    <div class="men-thumb-item">
                        <img src="img/${p.photo.src}" class="img-fluid prodSize" alt="${p.photo.alt}"/>
                    </div>
                    <div class="item-info-product">
                        <h5>${p.name}</h5>
                        <div class="product_price">
                            <h6 class="status">${statusProcess(p.status)}</h6>
                            <div class="grid-price">
                                <h6>${priceProcess(p.price)}</h6>
                            </div>
                        </div>
                        <p>${brandProcess(p.brand)}</p>
                    </div>
                </div>
            </div>`;
            });
            $("#productPrint").html(print);
        }   
    }    

    function statusProcess(status){
        let html = "";
        if(status != null){
            html += `<h6 class="status">${status}</h6>`;
        }
        else{
            html += "";
        }
        return html;
    }
    
    function priceProcess(price){
        let html = "";
        if(price.before != null){
            html += `<span class="line">$${price.before}</span>`;
        }
        html += ` $${price.current} `;
        return html;
    }
    
    function brandProcess(brandId){
        let brands = getLS("brands");
        let name = "";
        for(let brand of brands){
            if(brandId == brand.id){
                name = brand.name;
                break;
            }
        }
        return name;
    }
}