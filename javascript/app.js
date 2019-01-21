$(document).ready(function() {
    // Initialize firebase
    var config = {
        apiKey: "AIzaSyCXDupgvpnElVIFs8sARCXlDds_Ca-6PME",
        authDomain: "train-activity-1188c.firebaseapp.com",
        databaseURL: "https://train-activity-1188c.firebaseio.com",
        projectId: "train-activity-1188c",
        storageBucket: "train-activity-1188c.appspot.com",
        messagingSenderId: "514017328930"
    };
    firebase.initializeApp(config);

    //Initialize variables
    var database = firebase.database();
    var trainName = "";
    var destination = "";
    var firstTrainTime = "";
    var frecuency = 0;
    var trainInfo = "";
    var trainRow = "";

    var firstTimeConverted = "";
    var currentTime = "";
    var diffTime = "";
    var tRemainder = "";
    var tMinutesTillTrain = "";
    var nextTrain = "";

    //Calculate based on first train time and frecuency the next arrival and how many minutes away 
    function trainPrediction(frec, firstT){
        frequency = frec;
        firstTrainTime = firstT;
        firstTimeConverted = moment(firstTrainTime, "hh:mm");
        currentTime = moment();
        diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        tRemainder = diffTime % frequency;
        tMinutesTillTrain = frequency - tRemainder;
        nextTrain = moment().add(tMinutesTillTrain, "minutes");
    }

    //Add new rows to the table
    database.ref().on("child_added", function (snapshot) {
        trainName = snapshot.val().trainName;
        destination = snapshot.val().destination;
        firstTrainTime = snapshot.val().firstTrainTime;
        frecuency = snapshot.val().frecuency;
        trainPrediction(frecuency, firstTrainTime);

        trainInfo = $("#trainInfo");
        trainRow = $("<tr>");
        trainRow.append('<td>' + trainName);
        trainRow.append('<td>' + destination);
        trainRow.append('<td>' + frecuency);
        trainRow.append('<td>' + moment(nextTrain).format("hh:mm A"));
        trainRow.append('<td>' + tMinutesTillTrain);
        trainInfo.prepend(trainRow);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    //Add new train to the database
    $("#addTrain ").on("click", function () {
        trainName = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        firstTrainTime = $("#firstTrainTime").val().trim();
        frecuency = $("#frecuency").val().trim();

        if (trainName !== "" && destination !== "" && firstTrainTime !== "" && frecuency !== "") {
            database.ref().push({
                trainName: trainName,
                destination: destination,
                firstTrainTime: moment(firstTrainTime, "HH:mm").format("hh:mm A"),
                frecuency: frecuency,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });

            $("#trainName").val("");
            $("#destination").val("");
            $("#firstTrainTime").val("");
            $("#frecuency").val("");
        }
    });
});