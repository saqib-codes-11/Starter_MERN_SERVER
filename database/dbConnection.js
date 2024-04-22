const mongoose = require('mongoose');

const uri = "mongodb+srv://mernPro:mernPro@good-reads-data.7bpm9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

async function run() {
  try {
    // Connect the client to the server
    await mongoose.connect(uri);

    // Establish and verify connection
    console.log("Connected successfully to server");
  } catch(error) {
    // Ensures that the client will close when you finish/error
    console.log(error);
    process.exit(1);
  }
}
run();
