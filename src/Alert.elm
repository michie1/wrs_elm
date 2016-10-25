port module Alert exposing (..)

-- port for sending strings out to JavaScript
port check : String -> Cmd msg 

-- port for listening for suggestions from JavaScript


--port suggestions : (List String -> msg) -> Sub msg

--subscriptions : Model -> Sub Msg
--subscriptions model =
      --alert "hoi"
