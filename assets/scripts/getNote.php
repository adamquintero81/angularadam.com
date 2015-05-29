<?php
header("Content-Type: application/json; charset=UTF-8");
try {
	
	$unsafe_variable1 = $_GET["filter1"];
	$noslashes1 = stripslashes($unsafe_variable1);
	$filter1 = $noslashes1;

    $dbh = new PDO('');
	$dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	
	$stmt = $dbh->query('SELECT id,notes from angularreference WHERE id=' . $filter1);	
	$outp = "";
while($row = $stmt->fetch()) {

if ($outp != "") {$outp .= ",";}    

$outp .= '{"ID": '   . json_encode($row[0], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE)       . ',';
    
$outp .= '"Note": '. json_encode($row[1], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE)       . '}'; 

}
	
$outp ='{"records":['.$outp.']}';	echo($outp);
    
    $dbh = null;
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br>";
    die();
}
?>