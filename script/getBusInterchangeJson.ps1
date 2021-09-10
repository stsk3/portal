$FilePath = "C:\Users\swd\Desktop\test.txt"

if ([System.IO.File]::Exists($FilePath)) {
    Clear-Content $FilePath
}
Add-Content -Path $FilePath -Value "const busFArray = [];`nconst busBArray = [];`nconst busF2Array = [];`nconst busB2Array = [];`n"

#$RouteArray = @("64K","64P","65K","71A","71B","71K","71S","72","72A","72C","72X","73","73B","73D","73P","73X","74A","74B","74C","74D","74E","74F","74K","74P","74X","75K","75P","75X","263C","264R","265S","271","271B","271P","271S","271X","272A","272E","272P","272X","273C","273P","274P","274X","275R","307","307A","307P","900","907B","907C","A47X","E41","NA47","N271","N307","T74")
$RouteArray = @("51","53","54","64S","68","68A","68E","68F","68M","68X","69C","69M","69P","69X","76K","77K","251A","251B","251M","265B","265M","268A","268B","268C","268M","268P","268X","269A","269B","269C","269D","269M","269P","269S","276","276A","276B","276C","276P","869","968","968X","968A","A34","A36","A37","B1",,"E36","E36A","E36P","E36S","E37","NA36","NA37","N30","N73","N269","N368","P968")
For ($i=0; $i -lt $RouteArray.Length; $i++) {
    $Route = $RouteArray[$i]
    echo $Route

    $Bound = 'F'
    $Type = ''
    $Response = Invoke-WebRequest -Uri "https://www.kmb.hk/ajax/BBI/get_BBI2.php?routeno=$Route&Sorting=sec_routeno%20ASC&bound=$Bound&$Type"
    $ResponseContent = $Response.Content
    $Line = "busFArray['$Route'] = ``$ResponseContent``;"
    Add-Content -Path $FilePath -Value $Line

    $Bound = 'B'
    $Type = ''
    $Response = Invoke-WebRequest -Uri "https://www.kmb.hk/ajax/BBI/get_BBI2.php?routeno=$Route&Sorting=sec_routeno%20ASC&bound=$Bound&$Type"
    $ResponseContent = $Response.Content
    $Line = "busBArray['$Route'] = ``$ResponseContent``;"
    Add-Content -Path $FilePath -Value $Line

    $Bound = 'F'
    $Type = 'interchangeType=2'
    $Response = Invoke-WebRequest -Uri "https://www.kmb.hk/ajax/BBI/get_BBI2.php?routeno=$Route&Sorting=sec_routeno%20ASC&bound=$Bound&$Type"
    $ResponseContent = $Response.Content
    $Line = "busF2Array['$Route'] = ``$ResponseContent``;"
    Add-Content -Path $FilePath -Value $Line

    $Bound = 'B'
    $Type = 'interchangeType=2'
    $Response = Invoke-WebRequest -Uri "https://www.kmb.hk/ajax/BBI/get_BBI2.php?routeno=$Route&Sorting=sec_routeno%20ASC&bound=$Bound&$Type"
    $ResponseContent = $Response.Content
    $Line = "busB2Array['$Route'] = ``$ResponseContent``;"
    Add-Content -Path $FilePath -Value $Line

    Add-Content -Path $FilePath -Value ""
}

