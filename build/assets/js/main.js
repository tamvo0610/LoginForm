const 
    $ = document.querySelector.bind(document),
    $$ = document.querySelectorAll.bind(document)
document.addEventListener('DOMContentLoaded', function () {
    // Đăng kí
    Validator({
        formSelector: "#register-form",
        errorSelector: ".error-mess",
        inputSelector: ".input-box input"
    })
    // Đăng nhập
    Validator({
        formSelector: "#signin-form",
        errorSelector: ".error-mess",
        inputSelector: ".input-box input"
    })
})
    const passRegisRegister = document.querySelector(".register-box .pass")
    const repassRegister = document.querySelector(".register-box .confirm-pass")
function Validator(option){
    const form = document.querySelector(option.formSelector)
    const inputElement = form.querySelectorAll(option.inputSelector)
    const submitBtn = form.querySelector("button")
    passRegisRegister.onchange = function(){
        repassRegister.setAttribute("pattern",passRegisRegister.value)
    }

    // Check lỗi hành vi trên từng input
    inputElement.forEach(function(data){
        const errorElement = data.parentElement.querySelector(option.errorSelector)
        data.onblur = function(){
            checkValue(data)
        }
        data.oninput = function(){
            errorElement.innerHTML = null
        }
    })
    // Check lỗi khi nhấn submit
    submitBtn.onclick = function() {
        inputElement.forEach(function(data){
            checkValue(data)
        })
    }
    function checkValue(data){
        //  Kiểm tra điều kiện vào thẻ input
        if(data.value.trim()){
            // xét switch case
            switch (data.classList.value){
                case "email":
                    const regexEmail = new RegExp(data.getAttribute("pattern"))
                    regexEmail.test(data.value) ? removeErroMess(data) : showErroMess(data,`Vui lòng nhập đúng định dạng email`)
                    break;
                case "pass":
                    const regexPass = new RegExp(data.getAttribute("pattern")),
                            minLength = data.getAttribute("minlength"),
                            maxLength = data.getAttribute("maxlength")
                    regexPass.test(data.value) ? removeErroMess(data) : showErroMess(data,`Độ dài tối thiểu từ ${minLength} đến ${maxLength} kí tự`)
                    break;
                case "confirm-pass":
                    const regexConfirmPass = new RegExp(data.getAttribute("pattern"))
                    regexConfirmPass.test(data.value) ? removeErroMess(data) : showErroMess(data,`Mật khẩu nhập vào không đúng`)
                    break;
                default:
                    removeErroMess(data)
                    break
            }
        } else {
            showErroMess(data,`Dữ liệu bắt buộc`)
        }
        // Trả lỗi điều kiện
        function showErroMess(data,mess){
            const errorElement = data.parentElement.querySelector(option.errorSelector)
            data.parentElement.classList.add("invalid")
            errorElement.innerHTML = mess 
        } 
        function removeErroMess(data,mess){
            data.parentElement.classList.remove("invalid")
        }
    }
    
    // Lấy dữ liệu form khi click submit
    form.onsubmit = function(e){
        e.preventDefault()
        const formData = Array.from(inputElement).reduce(function(values,input){
            values[input.name] = input.value
                return values
        },{})
        switch (form.classList.value){
            case "register-box":
                addUser(formData,form)
                break;
            case "signin-box":
                checkUser(formData,form)
                break;
        }
    }
}
/** VERI ACCOUNT */
    /* ========== GET DATA FROM API*/
const dataAPI = 'http://localhost:3000/user'
function getData(callback){
    fetch(dataAPI)
    .then(function(response){
        return response.json()
    })
    .then(callback)
}
    /* ========== POST DATA TO API*/
function addAPI(formValues, callback){
    fetch(dataAPI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(formValues)
        })
    .then(function(response){
        return response.json()
    })
    .then(function(){
        
    })
}
    /* ========== GET DATA FROM LOCALSTORAGE*/
function getDataFromLocalStorage(){
    a = JSON.parse(localStorage.getItem("user"))
    return a 
}
    /* ========== POST DATA TO LOCALSTORAGE*/
function saveDataToLocalStorage(data){
    var a = []
    a = JSON.parse(localStorage.getItem("user")) || []
    a.push(data)
    localStorage.setItem("user", JSON.stringify(a))
}
    /* ========== HANDLE REGISTER */
        /** ========== Check user đã tồn tại chưa 
        */
function addUser(formData,form){
    /* ===== HANDLE WITH API */
    // getData(function(array_data){
    //     const checkSignIn = array_data.find(function(data){
    //         return formValues.email === data.email
    //     })
    //     const isValid = true
    //     if(!checkSignIn){
            
    //         addAPI(formValues)
    //         // getToast(formElement,isValid)
    //     } else {
    //         getToast(formElement,!isValid)
    //     }
    // })
    /* ===== HANDLE WITH LOCALSTORAGE */
    const localStorageData = getDataFromLocalStorage()
    const isValid = true
    if(localStorageData){
        const result = localStorageData.find(function(data){
            return formData.username === data.username
        })
        if(!result){
            getToast(form,isValid)
            saveDataToLocalStorage(formData)
        } else {
            getToast(form,!isValid)
        }
    } else {
        saveDataToLocalStorage(formData)
        getToast(form,isValid)
    }
}
    /* ========== HANDLE SIGN IN */
        /** ========== Check user tồn tại trong database không 
        */
function checkUser(formData,form){
    /* ===== HANDLE WITH API */
    // getData(function(array_data){
    //     const checkSignUp = array_data.find(function(data){
    //         return formValues.username === data.username && formValues.password === data.password
    //     })
    //     const isValid = true
    //     if(checkSignUp){
    //         getToast(formElement,isValid)
    //         // Truyền data user render
    //         renderUser(checkSignUp)
    //     } else {
    //         getToast(formElement,!isValid)
    //     }
    // })
    /* ===== HANDLE WITH LOCALSTORAGE */
    const localStorageData = getDataFromLocalStorage()
    const isValid = true
    const result = localStorageData.find(function(data) {
        return formData.username === data.username && formData.password === data.password
    })
    if(result){
        getToast(form,isValid)
            /* ===== Get data user để render ===== */
        renderUser(result)
    } else {
        getToast(form,!isValid)
    }
}
/** Toast Mess */
const toast = [
    {
        form: "signin-box",
        title: "Success",
        message: "Đăng nhập thành công !",
        type: "valid",
        confirm: true
    },
    {
        form: "signin-box",
        title: "Error",
        message: "Sai thông tin đăng nhập !",
        type: "invalid",
        confirm: false
    },
    {
        form: "register-box",
        title: "Success",
        message: "Đăng kí user thành công !",
        type: "valid",
        confirm: true
    },
    {
        form: "register-box",
        title: "Error",
        message: "Tài khoản đã tồn tại",
        type: "invalid",
        confirm: false
    }
]
const icon = {
    valid: "fas fa-solid fa-check",
    invalid: "fas fa-solid fa-exclamation"
}
function getToast(formElement,value){
    const check = toast.filter(function(data,index){
        return formElement.classList.value === data.form && value === data.confirm
    })
    const [result] = check
    renderToast(result,formElement)
}
function renderToast(data,formElement){
    const toastBlock = $("#toast")
    toastBlock.classList.remove("hidden")
    toastBlock.classList.add(data.type)
    toastBlock.style.animation = `slideInLeft ease 0.3s, fadeOut linear 0.5s 3s forwards`;
    toastBlock.innerHTML = `
                            <div class="toast-content flex flex-row justify-start items-center">
                                <i class="check ${data.type} ${icon[data.type]} cursor-pointer flex justify-center items-center hover:opacity-80"></i>
                                <div class="toast-mess flex flex-col justify-center items-start pl-4 pr-4">
                                    <span class="text text-1 font-semibold">${data.title}</span>
                                    <span class="text text-2 font-medium">${data.message}</span>
                                </div>
                                <i class="fa-solid fa-xmark close absolute top-3 right-3 cursor-pointer p-1 hover:opacity-80"></i>
                                <div class="progress absolute w-full bottom-0 left-0 h-0.5"></div>
                            </div>
                            `
    function autoRemoveToast(){
            toastBlock.classList.remove(data.type)
            toastBlock.classList.add("hidden")
    }
    // ===== REMOVE TOAST
    formElement.querySelector("button").onclick = function(){
        autoRemoveToast()
    }
    // setTimeout(autoRemoveToast,3500)                   
    $("#toast .toast-content .close").onclick = function(){
        autoRemoveToast()
    }
}
/* ========== Render Personal User ========== */
function renderUser(value){
    console.log(value)
}
