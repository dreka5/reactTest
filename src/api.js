

function GetToken(){return ""}
var API="http://45.141.101.66:2080/api/v1.0/"
//var API="http://localhost:5000/api/v1.0/"



async function getData2(url0 = '', data = {}) { 

  let url = API + url0;
  let token = GetToken();

  try {
      const response = await fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });
      let e = response;
      console.log('catch0',response);
      var js = await e.json();
      
      switch (response.status) {
          case 200:
              return js;
          case 400:
              console.log(js.errorCode, js.errorMessage);
              return 400;
          default:
              return js;
      }
  }
  catch (err) {
      console.log('catch',err);
  }
}


async function postData2(url0 = '', data = {}) {
  let url = API + url0;
  try {

      const response = await fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      let e = await response;
      var js = await e.json();
      switch (response.status) {
          case 200:
              return js;
          case 400:
              //ADD_ERR('post 400' + js.errorMessage + "  " + url);
              if (js.errorCode == 406) {
                  //LOGOFF();
                  return;
              }
              console.log(js.errorCode, js.errorMessage);
              return 400;
          default:
              return js;
      }
  }
  catch (err) {
      console.log(err);
  }
}


var Func = {
  GetFirm:async function (){
  var result= await getData2("Firm",{})
      result= await getData2("Firm",{})
      console.log(result);
  return result;
},

UpdateEmploye:async function (data){
  console.log(data);
  var result= await postData2("Employe/update",data)
     console.log(result);
  return result;
},

AddEmploye:
async function (data){
  var result= await postData2("Employe/add",data)
     console.log(result);
  return result;
},
AddFirm:
async function (data){
  var result= await postData2("Firm/add",data)
      console.log(result);
  return result;
},
UpdateFirm:async function (data){
  var result= await postData2("Firm/update",data)
      console.log(result);
  return result;
},
GetEmploye:async function (){
  var result= await getData2("Employe",{})
      result= await getData2("Employe",{})
      console.log(result);
  return result;
}



}
module.exports.Func = Func;
