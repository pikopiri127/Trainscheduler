// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyCJdOPSlD08P6LKdEvhnxZnat_bPDktrKQ",
  authDomain: "hsproject-3e79d.firebaseapp.com",
  databaseURL: "https://hsproject-3e79d.firebaseio.com",
  projectId: "hsproject-3e79d",
  storageBucket: "hsproject-3e79d.appspot.com",
  messagingSenderId: "460115286541"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Schedule
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs input
  var TrainName = $("#train-name-input").val().trim();
  var Destination = $("#destination-input").val().trim();
  var FirstTrain = $("#first-train-input").val();
  var Frequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var schedule = {
    trainName: TrainName,
    destination: Destination,
    firstTrain: FirstTrain,
    frequency: Frequency
  };

  // Uploads train data to the database
  database.ref().push(schedule);

  // Logs everything to console
  console.log(schedule.trainName);
  console.log(schedule.destination);
  console.log(schedule.firstTrain);
  console.log(schedule.frequency);

  alert("train schedule successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding schedule to the database and a row in the html when schedule adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var dbTrainName = childSnapshot.val().trainName;
  var dbDestination = childSnapshot.val().destination;
  var dbFirstTrain = childSnapshot.val().firstTrain;
  var dbFrequency = childSnapshot.val().frequency;

  // Train Info
  console.log("Train Name: " + dbTrainName);
  console.log("Destination: " + dbDestination);
  console.log("First Train: " + dbFirstTrain);
  console.log("Frequency: " + dbFrequency);

  // Calculate train Arrival & Minutes Away
  // First Train Time (pushed back 1 year to make sure it comes before current time)
  var firstTrainConverted = moment(dbFirstTrain, "HH:mm").subtract(1, "years");
  console.log(firstTrainConverted);  

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(firstTrainConverted, "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var calRemainder = diffTime % dbFrequency;
  console.log(calRemainder);

  // Minute Until train
  var calMinutesTillTrain = dbFrequency - calRemainder;
  console.log("MINUTES TILL Train: " + calMinutesTillTrain);

  // next train arrival time
  var calNextTrain = moment().add(calMinutesTillTrain, "minutes");
  var calNextTrainConverted = moment(calNextTrain).format("hh:mm");
  console.log("ARRIVAL TIME: " + calNextTrainConverted);

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(dbTrainName),
    $("<td>").text(dbDestination),
    $("<td>").text(dbFrequency),
    $("<td>").text(calNextTrainConverted),
    $("<td>").text(calMinutesTillTrain)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case
