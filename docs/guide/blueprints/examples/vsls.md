# vSLS

Uses the vSLS plugin annotations for on-join commands and matchmaking. For a field-by-field reference, see [Configuring vSLS](../../vsls/configuring#annotations-vsls).

```yaml

blueprint:
  id: "slsmp1"
  name: "SLSMP1"
  type: "archive"

server:
  software: "paper"
  version: "1.21.1"
  
state:
  volumes:
    - name: "world" 
      source: "worlds/archives/SLSMP1"
      target: "/world"
      mode: cow

annotations:

  # The vSLS plugin allows you to configure matchmaking and set commands to run when a player joins the server.

  vsls:
    # Tells vSLS to keep the server running even when no players are online.
    dont-stop-when-empty: true

    # Limits the number of concurrent instances of this blueprint to 1.
    max-instances: 1
    
    on-join:

      # says hello to the player when they join, using their name in the message
      - run: "say hello {PLAYER_NAME}"
      
      # Join sound
      - run: "playsound minecraft:block.note_block.bell ambient {PLAYER_NAME} ~ ~ ~ 1000 0"

    matchmaking:
      # Controls the number of players per instance. Setting this to 1 will create a new instance for every player that joins, allowing them to have their own separate world and progress.
      # Omit to allow unlimited players
      maxPlayers: 1
```
