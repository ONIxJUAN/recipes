function isAuthenticated(request, response) {
  const userIWantToEdit = request.params.id;
  const myOwnId = request.get("MyID");
  if (userIWantToEdit == myOwnId) {
    //verder met code
    console.log("user is authenticated");
  } else {
    //stuur een error
    console.error("ur not allowed to");
  }
}

module.exports = isAuthenticated;
