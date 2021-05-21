const request = require("async-request")

async function sc() {
for (i=0; i<100;i++) {
	email = "member" + i + "@keeptalents.com"
	password = getRandomArbitrary(10000000,99999999).toString()
	console.log("email is " +  email + "  " + "password is "+ password)
    res = await request("https://www.keeptalents.top/users/sales/create", {
	    method: 'POST',
        data: {
            email: email,
            password: password
        },
})
}
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

sc()
