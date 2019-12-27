# Create
file="test_build_input.file" 
while IFS= read line 
do 
    echo $line
    echo $line | websocat wss://server.staging.ink-remix.blockchain-it.hr/build
done <"$file"
