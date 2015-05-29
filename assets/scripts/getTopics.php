<?php
header("Content-Type: application/json; charset=UTF-8");
try {
	
    $dbh = new PDO('');
	$dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	
	$stmt = $dbh->query('SELECT id,title,keywords,description from angularreference LIMIT 100');	
	$outp = "";
while($row = $stmt->fetch()) {

if ($outp != "") {$outp .= ",";}    

$outp .= '{"ID": '   . json_encode($row[id], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE)       . ','; 
$outp .= '"Title": '   . json_encode($row[title], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE)       . ','; 
$outp .= '"Keywords": '. json_encode($row[keywords], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE)       . ',';
$outp .= '"Description": '. json_encode($row[description], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE)       . '}';
}
	
$outp ='{"records":['.$outp.']}';	echo($outp);
    
    $dbh = null;
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br>";
    die();
}
?>