<?php
header("Content-Type: application/json; charset=UTF-8");
try {
	
	$unsafe_variable1 = $_GET["filter1"];
	$noslashes1 = stripslashes($unsafe_variable1);
	$filter1 = "'%" . $noslashes1 . "%'";

	$unsafe_variable2 = $_GET["filter2"];
	$noslashes2 = stripslashes($unsafe_variable2);
	$filter2 = "'%" . $noslashes2 . "%'";

    $dbh = new PDO('');
	$dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	
	$stmt = $dbh->query('SELECT word,definition from dictionary WHERE word LIKE ' . $filter1 . ' AND definition LIKE ' . $filter2 . ' LIMIT 100');	
	$outp = "";
	while($row = $stmt->fetch()) {
        if ($outp != "") {$outp .= ",";}
    $outp .= '{"Word":"'   . strtolower($row[word])       . '",';
    $outp .= '"Definition":"'. $row[definition]     . '"}'; 
	}
	$outp ='{"records":['.$outp.']}';
	echo($outp);
    
    $dbh = null;
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}
?>