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

//CONTACT PAGE | FORM PROCESSING

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

if(url.indexOf("shop.html") != -1){
    // function getDataFromLS(name){
    //     return JSON.parse(localStorage.getItem(name));
    // }
    // function setDataToLS(name, data){
    //     localStorage.setItem(name, JSON.stringify(data));
    // }

    //DROPDOWN LIST FOR SORT

    ajaxCallback("options.json", printDDL);
    function printDDL(data){
        let print = "";
        for(let d of data){
            print += `<option value="${d.value}">${d.name}</option>`;
        }
        $("#sort").html(print);
        $("#sort").change(onChange);
    }

    //LOCAL STORAGE

    function setSortValueLS(){
        var sortValue = document.getElementById("sort").value;
        localStorage.setItem("sortValue", sortValue);
    }
    $("#sort").change(setSortValueLS);

    function checkSortValueLS(){
        let sortValue = localStorage.getItem("sortValue");
        if(sortValue != null){
            $("#sort").val(sortValue);
        }
    }

    //BRANDS FOR FILTER

    ajaxCallback("brands.json", printBrandsCHB);
    function printBrandsCHB(data){
        let print = `<h5 class="mt-2 mb-1">BRANDS</h5>`;
        for(let d of data){
            print += `<input type="checkbox" name="chb" id="chb${d.id}" class="brand"/>
            <label for="${d.name}" id="${d.id}" name="${d.id}">${d.name}</label><br/>`;
        }
        $("#brandDiv").html(print);
        brands = data;
        $("#brandDiv").change(onChange);
    }

    $("#radioDiv").change(onChange);

    function onChange(){
        ajaxCallback("products.json", productsPrint);
    }

    //SORT

    function sortProducts(product){
        let sortType = document.getElementById('sort').value;
        switch(sortType){
            case "price-asc" :
                return product.sort((previous, next) => previous.price.current > next.price.current ? 1 : -1)
            case "price-desc" :
                return product.sort((previous, next) => previous.price.current < next.price.current ? 1 : -1)
            case "name-desc" :
                return product.sort((previous, next) => previous.name < next.name ? 1 : -1)
            default:
                return product.sort((previous, next) => previous.name > next.name ? 1 : -1)
        }
    }

    //FILTER 

    function filterProducts(product){
        let chosenBrands = [];
		let chosenStatuses = [];

		$("input:checkbox[name=chb]:checked").each(function() { chosenBrands.push(parseInt($(this).attr('value'))); });
		$("input:radio[name=prodRadio]:checked").each(function() { chosenStatuses.push($(this).attr('value')); });

		let filteredProducts = product;

		if (chosenBrands.length > 0) {
			filteredProducts = filteredProducts.filter((x) => chosenBrands.includes(x.brand))
		}

		if (chosenStatuses.length > 0) {
			filteredProducts = filteredProducts.filter((x) => chosenStatuses.includes(x.status))
		}

        return filteredProducts;
    } 

    //FILTER BY SEARCH

    document.getElementById("searchProd").addEventListener("keyup", onChange);

    function filterBySearch(product){
        let filteredProducts;
        let searchedText = document.getElementById("searchProd").value;
        searchedText = searchedText.toLowerCase();
        if(searchedText.length > 0){
            filteredProducts = product.filter((p) => {
                return p.name.toLowerCase().includes(searchedText)
            })
            return filteredProducts;
        }
        else{
            return product;
        }
    }


    //PRODUCTS PRINT

    try{
        ajaxCallback("products.json", productsPrint);
    }
    catch{
        document.getElementById("productsPrint").innerHTML += `<p>Error loading products! Please try again later.</p>`;
    }

    function productsPrint(product){
        product = sortProducts(product);
        product = filterProducts(product);
        product = filterBySearch(product);
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
                        <input type="button" class="btn btn-dark add-to-cart" value="ADD TO CART"/>
                        <p id="addedToTheCart" class="d-none">Added to the cart!</p>
                    </div>
                </div>
            </div>`;
            });
        }

        $("#productPrint").html(print);
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
    
    let brands = [];
    ajaxCallback("brands.json", brandProcess);
    
    function brandProcess(brandId){
        for(let brand of brands) {
            if(brandId == brand.id) return brand.name;
        } 
    }


    //SHOPPING CART

    function createSidebar(array, type){
        let html = `<div class="sidebar">
                        <div class="row justify-content-center text-center p-3">
                            <p class="h2 col-10">Your ${type}</p>
                            <div onclick="closeSidebar()" class="col-2"><i class="far fa-times"></i></div>
                        </div>
                        <div class="p-3 w-100 row justify-content-center" id="sidebar-content">`;
        let pl = getLocalStorageItem("products");
        if(array && array.length > 0){
            for(let p of pl){
                for(i of array){
                    if(type == "cart" ? p.id==i.id : p.id==i){
                        html +=`<div class="w col-8 col-md-4 m-3 p-3 w-bg">
                                    <img src="img/${p.photo.src}" alt="${p.photo.alt}"/>
                                    <div class="p-3">
                                        <h5>${p.name}</h5>
                                        <p class="price h2">${p.price.current}$ <mark>${p.price.before ? p.price.before + "$" : ""}</mark></p>
                                        <p class="free">Quantitiy: ${i.value ? i.value : ""}</p>
                                        <p class="free h" onclick="rem${type == "cart"?"c":"w"}(${p.id})">Remove ${type == "cart"?"":"<i class='fas fa-heart-broken'></i>"}</p>
                                    </div>
                                </div>`
                    }
                }
            }
        }
        else {
            html += `<p class="mt-5">Your ${type} is empty!<br/>Visit our <a href="shop.html">shop</a> to add new items.</p>`;
        }
        html += "</div></div>"
        $('#main').append(html);
    }
    
    function closeSidebar(){
        document.querySelector(".sidebar").remove();
    }
    
    function cart(id){
        $('#addedToTheCart').fadeIn(500, function(){
            setTimeout(()=>{$('#addedToTheCart').fadeOut(500)},2000);
        });
        var ids = getLocalStorageItem("cart");
        if(!ids){
            ids=[];
            ids[0] = {"id":id,
                        "value":1}
            localStorage.setItem("cart", JSON.stringify(ids));
        }
        else{
            var n = 0;
            for(let i of ids){
                if(i.id==id){
                    i.value++;
                    n++;
                }
            }
            if(n==0){
                ids[ids.length] = {"id":id,
                                    "value":1}
            }
            localStorage.setItem("cart", JSON.stringify(ids));
        }
    }
    
    function getLocalStorageItem(name){
        let item = localStorage.getItem(name);
        if(item){
            parsedItem = JSON.parse(item);
            if(parsedItem.length > 0){
                return parsedItem;
            }
        }
        return false;
    }
}



