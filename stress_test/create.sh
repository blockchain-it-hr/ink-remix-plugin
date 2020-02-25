# Create
file="test_create_input.file" 
while IFS= read line 
do 
    echo "$line" | websocat wss://server.staging.ink-remix.blockchain-it.hr/new --one-message 
done <"$file"
