<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");
//header('Content-type: application/json');

        $url = $_GET['link'];

    $ch = curl_init();
        $curlConfig = array(
       CURLOPT_URL => $url
        );
        curl_setopt_array($ch, $curlConfig);
        $result = curl_exec($ch);
        curl_close($ch);
?>