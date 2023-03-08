// addEventListener("load", function() {
//     setTimeout(hideURLbar, 0);
// }, false);

// function hideURLbar() {
//     window.scrollTo(0, 1);
// }

let url = location.href;

function ajaxCallback(file, callback){
    $.ajax({
        url: "js/" + file,
        method: "get",
        dataType: "json",
        success: function(arr){
            callback(arr)
        },
        error: function(xhr){
            console.log(xhr);
        }
    })
}

if(url.indexOf("index.html") != -1){
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

// ajaxCallback("nav.json", footerPrint);
// function footerPrint(footerArr){
//     let print = `<div class="col-lg-3 footer_wthree_gridf mt-lg-5">
//     <h2><a href="index.html"><span>B</span>aggage
//         </a> </h2>
//     <label class="sub-des2">Online Store</label>
// </div>
// <div class="col-lg-3 footer_wthree_gridf mt-md-0 mt-4">
//     <ul class="footer_wthree_gridf_list">`;
//     if(arr.name == "Home" || arr.name == "About" || arr.name == "Shop"){
//         for(let arr of footerArr){
//             print += `<li>
//                         <a href="${arr.path}"><span class="fa fa-angle-right" aria-hidden="true"></span>${arr.name}</a>
//                     </li>`;
//         }
//         print += `</ul>
//     </div>
//     <div class="col-lg-3 footer_wthree_gridf mt-md-0 mt-sm-4 mt-3">
//         <ul class="footer_wthree_gridf_list">`;
//     }
//     else{
//         for(let arr of footerArr){
//             print += `<li>
//                         <a href="${arr.path}"><span class="fa fa-angle-right" aria-hidden="true"></span>${arr.name}</a>
//                     </li>`;
//         }
//         print += `</ul>
//                 </div>`;
//     }
//     $("#footer").html(print);
// }

ajaxCallback("socials.json", socialsPrint);
function socialsPrint(socialsArr){
    let print = `<ul>`;
    for(let arr of socialsArr){
        print += `<li><a href="${arr.path}"><span class="${arr.icon}"></span></a></li>`;
    }
    print += `</ul>`;
    $("#socialsPrint").html(print);
}

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
    function getDataFromLS(name){
        return JSON.parse(localStorage.getItem(name));
    }
    function setDataToLS(name, data){
        localStorage.setItem(name, JSON.stringify(data));
    }

    ajaxCallback("options.json", printDDL);
    function printDDL(data){
        let print = "";
        for(let d of data){
            print += `<option value="${d.value}">${d.name}</option>`;
        }
        $("#sort").html(print);
        $("#sort").change(onChange);
    }

    ajaxCallback("brands.json", printBrandsCHB);
    function printBrandsCHB(data){
        let print = `<h5 class="mt-2 mb-1">BRANDS</h5>`;
        for(let d of data){
            print += `<input type="checkbox" name="chb${d.id}" id="chb${d.id}" class="brand"/>
            <label for="${d.name}" id="${d.id}" name="${d.id}">${d.name}</label><br/>`;
        }
        $("#brandDiv").html(print);
        //$("#brandDiv").change(onChange);
        brands = data;
        $(".brand").change(onChange);
        //ajaxCallback("products.json", productsPrint);
    }

    function onChange(){
        ajaxCallback("products.json", productsPrint);
    }

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

    // $("input:radio[name=prodRadio]").change(onChange);
    // function filterBySale(product){
    //     var filteredProducts = [];
    //     let checked = $("input:radio[name=prodRadio]:checked").val();
    //     if(checked == 1){
    //         productsPrint(product);
    //     }
    //     else {
    //         for(let p of product){
    //             if(checked == p.price.before){
    //                 filteredProducts.push(p);
    //             }
    //         }
    //         productsPrint(filteredProducts);
    //     }
    // }

    function filterByBrand(product){
        let brandIds = [];
        let chosenBrands = document.querySelectorAll('.brand:checked');
        
        chosenBrands.forEach(b => {
            brandIds.push(Number(b.value))
        })
        if(brandIds.length) {
            console.log(brandIds.length);
            return product.filter(b => brandIds.includes(b.brand)
        )
        }
        return product;
    } 


    try{
        ajaxCallback("products.json", productsPrint);
    }
    catch{
        document.getElementById("productsPrint").innerHTML += `<p>Error loading products! Please try again later.</p>`;
    }

    function productsPrint(product){
        product = sortProducts(product);
        product = filterByBrand(product);
        product = filterBySearch(product);
        //product = filterBySale(product);
        let print = "";
        if(product.length == 0){
            print += `<div class="row">
                        <div id="searchText" class="col-12">
                            <p>Product with this name doesn't exist.</p>
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
        // $("#btnAdd").click(addToCart);
        // $("#btnAdd").click(function(){
        //     document.getElementById("addedToTheCart").classList.remove("d-none");
        // });
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
}