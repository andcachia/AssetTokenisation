window.changeAccount = function(){
  AccountAddress =  $("#account-number").val();
  localStorage.setItem("AccountAddress", AccountAddress);

  window.location.href = "./app/main.html";
}