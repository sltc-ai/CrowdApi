//////////////////////////////////////////////////////////////////
// Database connectivity
//////////////////////////////////////////////////////////////////

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect(
  //"mongodb://127.0.0.1:27017/socialDistance",
  "mongodb://socialDistanceUser:socialDistance%40#22335@34.224.106.79:27017/socialDistance",
  { 
  	useNewUrlParser: true,
  	useUnifiedTopology: true,
    useFindAndModify: false
  },
  (err, success) => {
    if (err) {
      console.log("Error in connection : ", err);
    } else {
      console.log("Database Connection Success !!");
    }
  }
);
