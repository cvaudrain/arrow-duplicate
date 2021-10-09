import isEmail from "validator/lib/isEmail"

const validate ={

 validateLogin : function(email,password){ //ensure pass and email meet requirements before continuing.
    let emailPassed=isEmail(email) //from validator node package isEmail
    let passwordPassed;
    var lower = /[a-z]/.test(password)
    var upper = /[A-Z]/.test(password)
    var num = /\d/.test(password)
    // var invalid = /\W/.test(password)
    var len = password.length
     if(lower == true && upper == true && num == true /*&& invalid == false*/ && len>=6){
         passwordPassed = true
     }
     else{passwordPassed = false}
     if(emailPassed && passwordPassed){
         console.log("validation PASSED")
         return true
     } else{
         console.log("validation FAILED")
         console.log(passwordPassed)
         console.log(emailPassed)
         return false
     }
    },
    validatePassword: function(password){ //ensure pass and email meet requirements before continuing.
        
        let passwordPassed;
        var lower = /[a-z]/.test(password)
        var upper = /[A-Z]/.test(password)
        var num = /\d/.test(password)
        // var invalid = /\W/.test(password)
        var len = password.length
         if(lower == true && upper == true && num == true /*&& invalid == false*/ && len>=6){
             passwordPassed = true
         }
         else{passwordPassed = false}
         if( passwordPassed){
             console.log("validation PASSED")
             return true
         } else{
             console.log("validation FAILED")
             console.log(passwordPassed)
             return false
         }
        },
        validateEmail: function(email){
            let emailPassed=isEmail(email) //from validator node package isEmail
           return emailPassed
        }

}

export default validate

    