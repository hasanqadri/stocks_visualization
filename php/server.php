<?php
//Set variables
$servername = "localhost";
$username = "cedrictstallwort";
$password = "";
$dbname = "QADRIhasan";

// Create connection
$con=mysqli_connect($servername, $username, $password, $dbname);

//Set up ID Query
$sqlID = "SELECT * FROM users WHERE (user = '" . $_GET["username"] . "' AND pass = '" . $_GET["password"] . "') " ;
//Run ID Query
$resultsID = mysqli_query($con, $sqlID);

//Execute and test
if (mysqli_num_rows($resultsID) == 0) {
    echo "Fail";
} else {
    //Set up Company Query
    $sqlCorp = "SELECT * FROM corp WHERE user = '" .$_GET["username"] . "'";
    //Run Company Query
    $resultsCorp = mysqli_query($con, $sqlCorp);
    if (mysqli_num_rows($resultsCorp) > 0) {
        // Make a JSON object
        $jsObj = "[";
        while($row = mysqli_fetch_assoc($resultsCorp)) {
            $jsObj .= '{';
            $jsObj .= '"username": "' . $row['user'] . '",';
            $jsObj .= '"corpname": "' . $row['corp'] . '",';
            $jsObj .= '"corpsymbol": "' . $row['symbol'] . '"';
            $jsObj .= '},';
        }
        $jsObj[ strlen($jsObj)-1 ] = "]";
        echo $jsObj;
    }

}
//Close server connection
mysqli_close($con);
?>